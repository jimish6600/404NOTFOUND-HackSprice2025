const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Get or Generate quiz for a subtopic
router.get('/subtopic/:subtopicId', quizController.getOrGenerateQuiz);

// Submit quiz answers
router.post('/:quizId/submit', quizController.submitQuiz);

// Get user's quiz history
router.get('/history/:userId', quizController.getQuizHistory);

module.exports = router; 