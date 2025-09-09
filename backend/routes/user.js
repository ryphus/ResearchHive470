const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get current user's profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update current user's profile
router.put('/profile/:id', async (req, res) => {
  const { name, bio, interests, publications, projects, affiliations, contact } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, bio, interests, publications, projects, affiliations, contact },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Get all users (for search) // connection de      
router.get('/all', async (req, res) => {
  const users = await User.find().select('_id name email');
  res.json(users);
});

module.exports = router;