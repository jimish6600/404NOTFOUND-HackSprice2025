const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Generate quiz for a subtopic
router.post('/generate/:subtopicId', quizController.generateQuiz);

// Submit quiz answers
router.post('/:quizId/submit', quizController.submitQuiz);

// Get user's quiz history
router.get('/history/:userId', quizController.getQuizHistory);

module.exports = router; 