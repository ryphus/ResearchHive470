const express = require('express');
const router = express.Router();
const ForumPost = require('../models/ForumPost');

// Get all posts
router.get('/', async (req, res) => {
  const posts = await ForumPost.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Create a post
router.post('/', async (req, res) => {
  const { type, title, content, author } = req.body;
  if (!type || !title || !content || !author) {
    return res.status(400).json({ error: 'All fields required' });
  }
  const post = new ForumPost({ type, title, content, author });
  await post.save();
  res.json(post);
});

// Like/unlike a post
router.post('/:id/like', async (req, res) => {
  const { user } = req.body;
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  if (post.likes.includes(user)) {
    post.likes = post.likes.filter(u => u !== user); // Unlike
  } else {
    post.likes.push(user); // Like
  }
  await post.save();
  res.json(post);
});

// Add a comment
router.post('/:id/comment', async (req, res) => {
  const { user, text } = req.body;
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  post.comments.push({ user, text });
  await post.save();
  res.json(post);
});

// Get single post
router.get('/:id', async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// Delete post (eta dibo na apadoto)
router.delete('/:id', async (req, res) => {
  await ForumPost.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;