const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

// Get all topics
router.get('/', topicController.getAllTopics);

// Get subtopics for a topic
router.get('/:topicId/subtopics', topicController.getSubtopics);

// Create new topic
router.post('/', topicController.createTopic);

// Create multiple subtopics for a topic
router.post('/:topicId/subtopics', topicController.createSubtopics);

// Generate content for selected subtopics
router.post('/subtopics/generate-content', topicController.generateSubtopicContent);

module.exports = router; 