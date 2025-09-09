const express = require('express');
const router = express.Router();
const Connection = require('../models/Connections');
const User = require('../models/user');
const Notification = require('../models/Notification');

// Send connection request
router.post('/request', async (req, res) => {
  const { requesterId, recipientId } = req.body;
  if (requesterId === recipientId) return res.status(400).json({ message: 'Cannot connect to yourself.' });
  const exists = await Connection.findOne({ requester: requesterId, recipient: recipientId });
  if (exists) return res.status(400).json({ message: 'Request already sent.' });
  const conn = new Connection({ requester: requesterId, recipient: recipientId });
  await conn.save();

  // Notify the recipient about the new connection request
  const requester = await User.findById(requesterId);
  if (requester) {
    await Notification.create({
      user: recipientId, // the user being requested
      message: `${requester.name} has sent you a connection request.`
    });
  }

  res.json(conn);
});

// Accept connection
router.post('/accept', async (req, res) => {
  const { connectionId } = req.body;
  const conn = await Connection.findById(connectionId);
  if (!conn) return res.status(404).json({ message: 'Connection not found.' });
  conn.status = 'accepted';
  await conn.save();

  // Notify users about the accepted connection
  const requester = await User.findById(conn.requester);
  const recipient = await User.findById(conn.recipient);
  const requesterName = requester ? requester.name : 'User';
  const recipientName = recipient ? recipient.name : 'User';

  await Notification.create({
    user: requesterId, // the user who sent the request
    message: `${recipientName} has accepted your connection request.`
  });
  await Notification.create({
    user: recipientId, // the user who accepted
    message: `You are now connected with ${requesterName}.`
  });

  res.json(conn);
});

// Reject connection
router.post('/reject', async (req, res) => {
  const { connectionId } = req.body;
  const conn = await Connection.findById(connectionId);
  if (!conn) return res.status(404).json({ message: 'Connection not found.' });
  conn.status = 'rejected';
  await conn.save();
  res.json(conn);
});

// Get user's connections and requests
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const connections = await Connection.find({
    $or: [{ requester: userId }, { recipient: userId }]
  }).populate('requester recipient', 'name email');
  res.json(connections);
});

// Remove connection
router.delete('/:id', async (req, res) => {
  await Connection.findByIdAndDelete(req.params.id);
  res.json({ message: 'Connection removed' });
});

module.exports = router;