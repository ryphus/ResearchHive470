const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications for a user
router.get('/:userId', async (req, res) => {
  const notes = await Notification.find({ user: req.params.userId }).sort({ createdAt: -1 });
  res.json(notes);
});

// Mark as read
router.put('/:id/read', async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ success: true });
});

module.exports = router;