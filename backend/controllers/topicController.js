const Topic = require('../models/Topic');const Subtopic = require('../models/Subtopic');
const geminiService = require('../services/geminiService');
const Quiz = require('../models/Quiz');
const UserProgress = require('../models/UserProgress');

const topicController = {
  // Get all topics
  getAllTopics: async (req, res) => {
    try {
      const topics = await Topic.find();
      res.json(topics);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error fetching topics', error: error.message });
    }
  },

  // Get subtopics for a topic based on difficulty level
  getSubtopics: async (req, res) => {
    try {
      const { topicId } = req.params;
      const { difficultyLevel } = req.query;

      const topic = await Topic.findById(topicId);
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' });
      }

      // First, try to get subtopics from the database
      const existingSubtopics = await Subtopic.find({
        topic: topicId,
        difficultyLevel: difficultyLevel,
      });

      if (existingSubtopics.length > 0) {
        // If subtopics exist in the database, return them with IDs
        return res.json({
          subtopics: existingSubtopics.map((st) => ({
            id: st._id,
            name: st.name,
          })),
          source: 'database',
        });
      }

      // If no subtopics exist, generate them using Gemini
      const generatedSubtopics = await geminiService.generateSubtopics(
        topic.name,
        difficultyLevel
      );

      // Save the generated subtopics to the database
      const createdSubtopics = await Promise.all(
        generatedSubtopics.map(async (name) => {
          const subtopic = new Subtopic({
            name,
            topic: topicId,
            difficultyLevel,
            description: `Learn about ${name} in ${topic.name}`,
          });
          await subtopic.save();
          return subtopic;
        })
      );

      res.json({
        subtopics: createdSubtopics.map((st) => ({
          id: st._id,
          name: st.name,
        })),
        source: 'gemini',
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error generating subtopics', error: error.message });
    }
  },

  // Create new topic
  createTopic: async (req, res) => {
    try {
      const { name, description } = req.body;
      const topic = new Topic({ name, description });
      await topic.save();
      res.status(201).json(topic);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error creating topic', error: error.message });
    }
  },

  // Create multiple subtopics without content
  createSubtopics: async (req, res) => {
    try {
      const { topicId } = req.params;
      const { subtopics, difficultyLevel } = req.body;

      const topic = await Topic.findById(topicId);
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' });
      }

      const createdSubtopics = await Promise.all(
        subtopics.map(async (name) => {
          const subtopic = new Subtopic({
            name,
            topic: topicId,
            difficultyLevel,
            description: `Learn about ${name} in ${topic.name}`,
          });
          await subtopic.save();
          return subtopic;
        })
      );

      res.status(201).json(createdSubtopics);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error creating subtopics', error: error.message });
    }
  },

  // Generate content for selected subtopics
  generateSubtopicContent: async (req, res) => {
    try {
      const { subtopicId, userId, subtopicName } = req.body;

      // Generate content for the subtopic
      const subtopic = await Subtopic.findById(subtopicId);
      if (!subtopic) {
        return res.status(404).json({ message: 'Subtopic not found' });
      }

      // Generate content (your existing content generation logic)
      const generatedContent = await generateContent(
        subtopicName || subtopic.name
      );
      subtopic.content = generatedContent;
      await subtopic.save();

      // Generate or get quiz for the subtopic
      let quiz = await Quiz.findOne({ subtopic: subtopicId });
      if (!quiz) {
        quiz = await generateQuiz(subtopic);
      }

      // Create or update user progress
      let userProgress = await UserProgress.findOne({
        user: userId,
        subtopic: subtopicId,
      });

      if (!userProgress) {
        userProgress = new UserProgress({
          user: userId,
          subtopic: subtopicId,
          quizAttempts: [],
          suggestedNextSubtopics: [],
          lastAccessed: new Date(),
        });
        await userProgress.save();
      }

      res.json({
        message: 'Content and quiz generated successfully',
        subtopic: {
          _id: subtopic._id,
          name: subtopic.name,
          content: subtopic.content,
        },
        quiz: quiz,
        userProgress: userProgress,
      });
    } catch (error) {
      console.error('Error generating content:', error);
      res
        .status(500)
        .json({ message: 'Error generating content', error: error.message });
    }
  },
};

// Helper function to generate quiz
async function generateQuiz(subtopic) {
  // Your quiz generation logic here
  const quiz = new Quiz({
    subtopic: subtopic._id,
    questions: [
      // Generated questions based on subtopic content
    ],
    difficultyLevel: 'intermediate',
  });
  await quiz.save();
  return quiz;
}

// Helper function to generate content
async function generateContent(subtopicName) {
  // Your content generation logic here
  return `Generated content for ${subtopicName}`;
}

module.exports = topicController;
