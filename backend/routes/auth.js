//auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    // Check if username exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Bhai onno username den, Eta arekjon diye felse :'(" });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ username, name, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    // No user found with that email
    return res.status(400).json({ message: 'User not found' });
  }
  // Check if password matches
  if (user.password !== password) {
    // Password is wrong
    return res.status(400).json({ message: 'Wrong password' });
  }
  // Login successful!
  res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
});

module.exports = router;