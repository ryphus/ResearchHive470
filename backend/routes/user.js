const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Search users by username
router.get('/search', async (req, res) => {
  const { username } = req.query;
  if (!username) return res.json([]);
  const users = await User.find({ username: { $regex: username, $options: 'i' } }).select('username');
  res.json(users);
});

module.exports = router;
