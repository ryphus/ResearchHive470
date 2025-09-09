const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // recipient
  type: { type: String, required: true }, // e.g. 'connection', 'event', 'forum', etc.
  message: { type: String, required: true },
  link: { type: String }, // URL to redirect on click
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);