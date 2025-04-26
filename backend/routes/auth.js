const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register new user
router.post('/register', authController.register);

router.get('/', (req, res)=>{
    res.send("Hello World");
});
// Login user
router.post('/login', authController.login);

module.exports = router; 