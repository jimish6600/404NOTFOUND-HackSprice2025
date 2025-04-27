// server.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdf = require('pdf-parse');
const { getSubtitles } = require('youtube-captions-scraper'); // New import
const axios = require('axios');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client/build')));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(__dirname, 'uploads', req.body.userId || 'anonymous');
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Globals
let userDocuments = {}; // Will hold document chunks by user
let userChatHistory = {}; // Will hold chat history by user

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || 'AIzaSyApJygMH5MV_b-npZk3cLrhM-nB6PHUmgk');
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.2
  }
});

// Home route
app.get('/api/health', (req, res) => {
  res.json({ message: 'RAG Express server with Gemini 2.0 Flash is running!' });
});

// Get user chat history
app.get('/api/history/:userId', (req, res) => {
  const { userId } = req.params;
  if (!userChatHistory[userId]) {
    userChatHistory[userId] = [];
  }
  res.json(userChatHistory[userId]);
});

// Process PDF file
async function processPdfFile(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

// New YouTube captions extraction function
async function getYouTubeCaptions(videoId) {
  try {
    console.log("Getting YouTube captions for video:", videoId);
    
    // Get captions using youtube-captions-scraper
    const captionsArray = await getSubtitles({
      videoID: videoId,
      lang: 'en' // default to English captions
    });
    
    // Convert captions array to text format
    const captionsText = captionsArray
      .map(caption => caption.text)
      .join(' ');
    
    if (!captionsText) {
      throw new Error('No captions available for this video');
    }
    
    return captionsText;
  } catch (error) {
    console.error('Error getting YouTube captions:', error);
    throw error;
  }
}

// Upload Document Route
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const { userId, contentType, youtubeUrl, customText } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Initialize user document store if not exists
    if (!userDocuments[userId]) {
      userDocuments[userId] = [];
    }

    let content = '';

    // Process based on content type
    if (contentType === 'pdf' && req.file) {
      const filePath = req.file.path;
      content = await processPdfFile(filePath);
      console.log("PDF processed");
    } else if (contentType === 'text' && customText) {
      content = customText;
      console.log("Custom text processed");
    } else if (contentType === 'youtube' && youtubeUrl) {
      // Extract video ID from YouTube URL
      let videoId;
      
      // Handle different YouTube URL formats
      if (youtubeUrl.includes('youtube.com/watch')) {
        videoId = new URL(youtubeUrl).searchParams.get('v');
      } else if (youtubeUrl.includes('youtu.be/')) {
        videoId = youtubeUrl.split('youtu.be/')[1].split('?')[0];
      } else {
        return res.status(400).json({ message: 'Invalid YouTube URL format' });
      }
      
      if (!videoId) {
        return res.status(400).json({ message: 'Could not extract video ID from URL' });
      }
      
      content = await getYouTubeCaptions(videoId);
      console.log("YouTube captions processed successfully",content);

    } else if (req.file) {
      // Default to text file processing
      const filePath = req.file.path;
      content = fs.readFileSync(filePath, 'utf8');
      console.log("Text file processed");
    } else {
      return res.status(400).json({ message: 'No content provided' });
    }
    
    // Split into chunks (simple split every 500 characters)
    const chunks = content.match(/(.|[\r\n]){1,500}/g) || [];
    
    // Add user metadata to chunks
    const userChunks = chunks.map(text => ({ 
      text, 
      userId, 
      timestamp: Date.now(),
      source: contentType
    }));
    
    // Add to user's documents
    userDocuments[userId] = [...(userDocuments[userId] || []), ...userChunks];
    
    console.log(`Documents stored for user ${userId}:`, userDocuments[userId].length);
    
    // Clean up uploaded file if it exists
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.json({ 
      message: 'Content processed and stored!',
      chunks: userChunks.length,
      totalUserChunks: userDocuments[userId].length
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Enhanced keyword-based search function with user filtering
function searchDocuments(query, userId, limit = 5) {
  if (!userDocuments[userId] || userDocuments[userId].length === 0) {
    return [];
  }
  
  const keywords = query.toLowerCase().split(/\s+/);
  
  return userDocuments[userId]
    .map(doc => {
      const text = doc.text.toLowerCase();
      // Count keyword matches
      const score = keywords.reduce((count, keyword) => {
        return count + (text.includes(keyword) ? 1 : 0);
      }, 0);
      return { doc, score };
    })
    .filter(item => item.score > 0)  // Only keep documents with matches
    .sort((a, b) => b.score - a.score)  // Sort by score descending
    .slice(0, limit)  // Take top results
    .map(item => item.doc);  // Return just the documents
}

// Ask Question Route
app.post('/api/ask', async (req, res) => {
  try {
    const { question, userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    console.log(`Question received from user ${userId}:`, question);
    
    // Initialize user history if not exists
    if (!userChatHistory[userId]) {
      userChatHistory[userId] = [];
    }
    
    if (!userDocuments[userId] || userDocuments[userId].length === 0) {
      const answer = "Please upload some content first so I can help answer your questions based on that information.";
      
      // Save to history
      userChatHistory[userId].push({
        role: 'user',
        content: question,
        timestamp: Date.now()
      });
      
      userChatHistory[userId].push({
        role: 'assistant',
        content: answer,
        timestamp: Date.now()
      });
      
      return res.json({ answer });
    }

    // Find relevant documents with simple keyword search
    const relevantDocs = searchDocuments(question, userId);
    console.log(`Relevant documents found for user ${userId}:`, relevantDocs.length);
    
    // Save user question to history
    userChatHistory[userId].push({
      role: 'user',
      content: question,
      timestamp: Date.now()
    });
    
    if (relevantDocs.length === 0) {
      const answer = "I couldn't find any relevant information in your uploaded content to answer your question.";
      
      // Save to history
      userChatHistory[userId].push({
        role: 'assistant',
        content: answer,
        timestamp: Date.now()
      });
      
      return res.json({ answer });
    }
    
    // Combine context and question for the LLM
    const context = relevantDocs.map(doc => doc.text).join("\n\n");
    
    // Get recent chat history for context (last 5 exchanges)
    const recentHistory = userChatHistory[userId].slice(-10);
    const historyContext = recentHistory.map(msg => `${msg.role}: ${msg.content}`).join("\n");
    console.log("context:",historyContext);
    const prompt = `
    Context information:
    ${context}

    
    Recent conversation history:
    ${historyContext}
    
    Based only on the context information provided and considering the conversation history, answer the following question: ${question}
    
    If the information cannot be found in the context, politely indicate that you don't have that information.
    `;
    
    console.log("Sending request to Gemini");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const answer = response.text();
    console.log("Response received from Gemini");
    
    // Save assistant response to history
    userChatHistory[userId].push({
      role: 'assistant',
      content: answer,
      timestamp: Date.now()
    });
    
    // Keep history at a reasonable size (last 50 messages)
    if (userChatHistory[userId].length > 50) {
      userChatHistory[userId] = userChatHistory[userId].slice(-50);
    }
    
    res.json({ answer });
  } catch (error) {
    console.error('Ask error:', error);
    res.status(500).json({ message: 'Question answering failed', error: error.message });
  }
});

// Clear user data
app.delete('/api/user/:userId/data', (req, res) => {
  const { userId } = req.params;
  
  if (userDocuments[userId]) {
    delete userDocuments[userId];
  }
  
  if (userChatHistory[userId]) {
    delete userChatHistory[userId];
  }
  
  res.json({ message: `Data for user ${userId} has been cleared` });
});

// Get all user documents (for debugging)
app.get('/api/admin/users', (req, res) => {
  // In production, this should be protected with admin authentication
  const users = Object.keys(userDocuments);
  const stats = users.map(userId => ({
    userId,
    documentCount: userDocuments[userId]?.length || 0,
    messageCount: userChatHistory[userId]?.length || 0
  }));
  
  res.json({ users: stats });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});