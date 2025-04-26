const express = require('express');
const router = express.Router();
const courseController = require('../controller/courseController');
const authenticate = require('../middleware/Authmiddleware');

// Create course route

router.post('/create', authenticate, courseController.createCourse);

module.exports = router; 