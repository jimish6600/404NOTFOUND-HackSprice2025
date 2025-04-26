const express = require('express');
const router = express.Router();
const courseController = require('../controller/courseController');

// Create course route

router.post('/create', courseController.createCourse);

module.exports = router; 