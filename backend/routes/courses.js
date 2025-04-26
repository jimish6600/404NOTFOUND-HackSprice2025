const express = require('express');const router = express.Router();
const courseController = require('../controllers/courseController');

// Create user progress entry
router.post('/progress', courseController.createUserProgress);

// Get all user progress entries (course list)
router.get('/', courseController.getAllUserProgress);

// Get details of a specific course
router.get('/:topicId', courseController.getCourseDetails);

// Create a new course with selected topic and difficulty
router.post('/', courseController.createCourse);

// Add subtopics and content to a course
router.post('/:courseId/subtopics', courseController.addSubtopics);

// Update quiz attempt for a subtopic
router.put('/quiz', courseController.updateQuizAttempt);

module.exports = router;
