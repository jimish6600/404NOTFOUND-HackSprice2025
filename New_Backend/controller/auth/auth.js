const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');


const Userregister = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Check if required fields are provided
  if (!email || !username || !password || !confirmPassword) {
    return res.json({ message: 'Please provide email, username, password, and confirm password', success: false });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.json({ message: 'Passwords do not match' , success: false});
  }

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.json({ message: 'Username or email already exists' , success: false });
    }

    // Create new user
    const user = new User({ email, username, password });
    await user.save();

    // Respond with success
    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    res.json({
      message: 'Error registering user',
      success: false
    });
  }
};



const Userlogin = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.json({ message: 'Please provide username and password' });
    }
  
    try {
      const user = await User.findOne({ username });
      
      if (!user || !(await user.comparePassword(password))) {
        return res.json({ message: 'Invalid email or password' });
      }
      
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
      
      console.log("jimish")
      res.status(200).json({ 
        message: 'Login successful', 
        token : token,
        success: true,
        username : username
      });
    } catch (error) {
      console.error('Error logging in user:', error.message);
      res.json({ 
        message: 'Error logging in user', 
        success: false 
      });
    }
};
  
module.exports = {Userregister,Userlogin};

