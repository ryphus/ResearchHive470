const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');

// Add a bookmark
router.post('/', async (req, res) => {
  const { user, type, item } = req.body;
  const exists = await Bookmark.findOne({ user, type, item });
  if (exists) return res.status(400).json({ message: 'Already bookmarked' });
  const bookmark = new Bookmark({ user, type, item });
  await bookmark.save();
  res.json(bookmark);
});

// Get all bookmarks for a user
router.get('/:userId', async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.params.userId });
  res.json(bookmarks);
});

// Get bookmarks for a user and type
router.get('/user/:userId/type/:type', async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.params.userId, type: req.params.type });
  res.json(bookmarks);
});

// Remove a bookmark
router.delete('/:id', async (req, res) => {
  await Bookmark.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;