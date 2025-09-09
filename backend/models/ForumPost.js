const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  text: String,
  date: { type: Date, default: Date.now }
});

const forumPostSchema = new mongoose.Schema({
  type: String,
  title: String,
  content: String,
  author: String,
  authorId: String,
  likes: [String], // store user IDs
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('ForumPost', forumPostSchema);