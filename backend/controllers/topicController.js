const Topic = require('../models/Topic');
const Subtopic = require('../models/Subtopic');
const geminiService = require('../services/geminiService');

const topicController = {
  // Get all topics
  getAllTopics: async (req, res) => {
    try {
      const topics = await Topic.find();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching topics', error: error.message });
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
        difficultyLevel: difficultyLevel 
      });

      if (existingSubtopics.length > 0) {
        // If subtopics exist in the database, return them
        return res.json({ 
          subtopics: existingSubtopics.map(st => st.name),
          source: 'database'
        });
      }

      // If no subtopics exist, generate them using Gemini
      const generatedSubtopics = await geminiService.generateSubtopics(topic.name, difficultyLevel);
      
      // Save the generated subtopics to the database
      const createdSubtopics = await Promise.all(
        generatedSubtopics.map(async (name) => {
          const subtopic = new Subtopic({
            name,
            topic: topicId,
            difficultyLevel,
            description: `Learn about ${name} in ${topic.name}`
          });
          await subtopic.save();
          return subtopic;
        })
      );

      res.json({ 
        subtopics: generatedSubtopics,
        source: 'gemini'
      });
    } catch (error) {
      res.status(500).json({ message: 'Error generating subtopics', error: error.message });
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
      res.status(500).json({ message: 'Error creating topic', error: error.message });
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
            description: `Learn about ${name} in ${topic.name}`
          });
          await subtopic.save();
          return subtopic;
        })
      );

      res.status(201).json(createdSubtopics);
    } catch (error) {
      res.status(500).json({ message: 'Error creating subtopics', error: error.message });
    }
  },

  // Generate content for selected subtopics
  generateSubtopicContent: async (req, res) => {
    try {
      const { subtopicIds } = req.body;

      const subtopics = await Subtopic.find({ _id: { $in: subtopicIds } });
      if (subtopics.length === 0) {
        return res.status(404).json({ message: 'No subtopics found' });
      }

      const updatedSubtopics = await Promise.all(
        subtopics.map(async (subtopic) => {
          const content = await geminiService.generateSubtopicContent(
            subtopic.name,
            subtopic.difficultyLevel
          );
          subtopic.content = content;
          await subtopic.save();
          return subtopic;
        })
      );

      res.json(updatedSubtopics);
    } catch (error) {
      res.status(500).json({ message: 'Error generating content', error: error.message });
    }
  }
};

module.exports = topicController; 