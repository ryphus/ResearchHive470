const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: String, // You can use ObjectId if you have a User model
  text: String,
  date: { type: Date, default: Date.now }
});

const forumPostSchema = new mongoose.Schema({
  type: { type: String, enum: ['idea', 'issue'], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true }, // Use ObjectId for real user system
  likes: [{ type: String }], // Array of user IDs or usernames
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ForumPost', forumPostSchema);