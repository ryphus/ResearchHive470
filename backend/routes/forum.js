const express = require('express');
const router = express.Router();
const ForumPost = require('../models/ForumPost');
const Connections = require('../models/Connections');
const Notification = require('../models/Notification');

// Get all posts
router.get('/', async (req, res) => {
  const posts = await ForumPost.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Create a post
router.post('/', async (req, res) => {
  const { type, title, content, author, authorId } = req.body;
  if (!type || !title || !content || !author || !authorId) {
    return res.status(400).json({ error: 'All fields required' });
  }
  try {
    const post = new ForumPost({ type, title, content, author, authorId, likes: [], comments: [] });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/unlike a post
router.post('/:id/like', async (req, res) => {
  const { userId } = req.body;
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter(u => u !== userId); // Unlike
  } else {
    post.likes.push(userId); // Like
  }
  await post.save();
  res.json(post);
});

// Add a comment
router.post('/:id/comment', async (req, res) => {
  const { userId, userName, text } = req.body;
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  post.comments.push({ userId, userName, text });
  await post.save();

  // Notify the post owner about the new comment
  if (post.owner.toString() !== userId) {
    await Notification.create({
      user: post.owner,
      message: `${userName} commented on your forum post "${post.title}".`
    });
  }

  res.json(post);
});

// Edit a post (only owner)
router.put('/:id', async (req, res) => {
  const { userId, title, content } = req.body;
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.authorId !== userId) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  await post.save();
  res.json(post);
});

// Delete a post (only owner)
router.delete('/:id', async (req, res) => {
  const { userId } = req.body;
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.authorId !== userId) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  await ForumPost.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Get latest 6 forum posts by user's connections
router.get('/latest-by-connections/:userId', async (req, res) => {
  try {
    // Find all accepted connections for the user
    const connections = await Connections.find({
      status: 'accepted',
      $or: [{ requester: req.params.userId }, { recipient: req.params.userId }]
    });

    // Get connected user IDs
    const connectedUserIds = connections.map(c =>
      c.requester.toString() === req.params.userId ? c.recipient : c.requester
    );

    // Find latest 6 forum posts by these users
    const posts = await ForumPost.find({ authorId: { $in: connectedUserIds } })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching post' });
  }
});

module.exports = router;