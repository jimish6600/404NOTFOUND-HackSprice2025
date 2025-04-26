const express = require('express');
const router = express.Router();
const courseController = require('../controller/courseController');
const authenticate = require('../middleware/Authmiddleware');

// Create course route

router.post('/create', authenticate, courseController.createCourse);

// Get all courses
router.get('/', authenticate, courseController.getAllCourses);

// Get course details
router.get('/:courseId', authenticate, courseController.getCourseDetails);

module.exports = router; 