import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [userId, setUserId] = useState('user123');
  const [file, setFile] = useState(null);
  const [customText, setCustomText] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('pdf');
  const [chatOpen, setChatOpen] = useState(false);

  // Fetch chat history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:3000//api/history/${userId}`);
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, [userId]);

  // Handle file upload
  const handleFileUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    
    if (activeTab === 'pdf' && file) {
      formData.append('file', file);
      formData.append('contentType', 'pdf');
    } else if (activeTab === 'text' && customText) {
      formData.append('customText', customText);
      formData.append('contentType', 'text');
    } else if (activeTab === 'youtube' && youtubeUrl) {
      formData.append('youtubeUrl', youtubeUrl);
      formData.append('contentType', 'youtube');
    } else {
      setMessage('Please provide content before uploading');
      setLoading(false);
      return;
    }
    
    formData.append('userId', userId);

    try {
      const response = await axios.post('https://four04notfound-hacksprice2025-1.onrender.com/api/upload', formData);
      setMessage(`Content processed! ${response.data.chunks} chunks uploaded.`);
      setChatOpen(true);
      setLoading(false);
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage('Upload failed. Please try again.');
      setLoading(false);
    }
  };

  // Ask a question
  const handleAskQuestion = async () => {
    if (!question.trim()) {
      setMessage('Please enter a question');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post('https://four04notfound-hacksprice2025-1.onrender.com/api/ask', { question, userId });
      setAnswer(response.data.answer);
      setQuestion('');
      setLoading(false);
    } catch (error) {
      console.error('Error asking question:', error);
      setMessage('Error processing your question.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-4 md:p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white text-center relative">
          <h1 className="text-2xl md:text-3xl font-bold">KnowledgeBot</h1>
          <p className="text-blue-100">Your personal AI assistant</p>
        </div>

        {/* Main content */}
        <div className="p-4 md:p-6">
          {!chatOpen ? (
            <>
              {/* Robot Character */}
              <div className="flex justify-center mb-6">
                <div className="relative w-48 h-48">
                  <div className="absolute w-full h-full bg-blue-300 rounded-full opacity-30 animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-blue-400 w-36 h-36 rounded-full flex items-center justify-center shadow-lg">
                      <div className="bg-white w-32 h-32 rounded-full relative">
                        {/* Eyes */}
                        <div className="absolute top-8 left-6 w-6 h-8 bg-blue-900 rounded-full"></div>
                        <div className="absolute top-8 right-6 w-6 h-8 bg-blue-900 rounded-full"></div>
                        {/* Smile */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-6 border-b-4 border-blue-900 rounded-full"></div>
                        {/* Antenna */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-blue-600"></div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  {/* Arms */}
                  <div className="absolute left-0 top-1/2 w-10 h-4 bg-blue-400 rounded-full transform -translate-x-4"></div>
                  <div className="absolute right-0 top-1/2 w-10 h-4 bg-blue-400 rounded-full transform translate-x-4"></div>
                </div>
              </div>

              {/* Upload Options */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <button 
                  className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-md transition ${activeTab === 'pdf' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50 hover:bg-blue-50'}`}
                  onClick={() => setActiveTab('pdf')}
                >
                  <div className="bg-white p-2 rounded-lg mb-2">
                    <svg className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 18H17V16H7V18Z" fill="currentColor" />
                      <path d="M17 14H7V12H17V14Z" fill="currentColor" />
                      <path d="M7 10H11V8H7V10Z" fill="currentColor" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.13401 17.866 2 14 2H6ZM6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="font-medium">Upload PDF</span>
                </button>

                <button 
                  className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-md transition ${activeTab === 'youtube' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50 hover:bg-blue-50'}`}
                  onClick={() => setActiveTab('youtube')}
                >
                  <div className="bg-white p-2 rounded-lg mb-2">
                    <svg className="w-10 h-10 text-red-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.543 6.498C22 8.28 22 12 22 12C22 12 22 15.72 21.543 17.502C21.289 18.487 20.546 19.262 19.605 19.524C17.896 20 12 20 12 20C12 20 6.107 20 4.395 19.524C3.45 19.258 2.708 18.484 2.457 17.502C2 15.72 2 12 2 12C2 12 2 8.28 2.457 6.498C2.711 5.513 3.454 4.738 4.395 4.476C6.107 4 12 4 12 4C12 4 17.896 4 19.605 4.476C20.55 4.742 21.292 5.516 21.543 6.498ZM10 15.5L16 12L10 8.5V15.5Z" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="font-medium">YouTube Link</span>
                </button>

                <button 
                  className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-md transition ${activeTab === 'text' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50 hover:bg-blue-50'}`}
                  onClick={() => setActiveTab('text')}
                >
                  <div className="bg-white p-2 rounded-lg mb-2">
                    <svg className="w-10 h-10 text-blue-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM5 5H19V19H5V5Z" fill="currentColor" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M6 7C6 6.44772 6.44772 6 7 6H17C17.5523 6 18 6.44772 18 7C18 7.55228 17.5523 8 17 8H7C6.44772 8 6 7.55228 6 7Z" fill="currentColor" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M6 11C6 10.4477 6.44772 10 7 10H17C17.5523 10 18 10.4477 18 11C18 11.5523 17.5523 12 17 12H7C6.44772 12 6 11.5523 6 11Z" fill="currentColor" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M6 15C6 14.4477 6.44772 14 7 14H12C12.5523 14 13 14.4477 13 15C13 15.5523 12.5523 16 12 16H7C6.44772 16 6 15.5523 6 15Z" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="font-medium">Custom Text</span>
                </button>
              </div>

              {/* Content Input Based on Selected Option */}
              <div className="mb-6">
                {activeTab === 'pdf' && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="block text-blue-800 font-medium mb-2">Select PDF File</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {file && <p className="mt-2 text-sm text-blue-700">Selected: {file.name}</p>}
                  </div>
                )}

                {activeTab === 'youtube' && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <label className="block text-red-800 font-medium mb-2">Enter YouTube URL</label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}

                {activeTab === 'text' && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="block text-blue-800 font-medium mb-2">Enter Custom Text</label>
                    <textarea
                      placeholder="Type or paste your text here..."
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                onClick={handleFileUpload}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Upload Content
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* Chat Interface */}
              <div className="mb-4 bg-gray-50 p-4 rounded-lg h-64 overflow-y-auto border border-gray-200">
                {history.length > 0 ? (
                  history.map((msg, index) => (
                    <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>Your chat will appear here. Ask a question to get started!</p>
                  </div>
                )}
                {answer && (
                  <div className="mb-3 text-left">
                    <div className="inline-block px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
                      {answer}
                    </div>
                  </div>
                )}
              </div>

              {/* Question Input */}
              <div className="flex">
                <input
                  type="text"
                  placeholder="Ask me a question about your content..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg transition"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  )}
                </button>
              </div>

              {/* Back to Upload Button */}
              <button
                onClick={() => setChatOpen(false)}
                className="mt-4 text-blue-600 hover:underline flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Content Upload
              </button>
            </>
          )}

          {/* Error Message */}
          {message && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
              {message}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-3 text-center text-gray-600 text-sm">
          <p>Powered by Gemini 2.0 Flash • Built with React & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;