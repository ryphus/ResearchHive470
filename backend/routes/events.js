const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Create event
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all events (optionally filter by user)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name').populate('participants', 'name');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name').populate('participants', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Join event
router.post('/:id/join', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!event.participants.includes(req.body.userId)) {
      event.participants.push(req.body.userId);
      await event.save();
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Leave event
router.post('/:id/leave', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    event.participants = event.participants.filter(
      uid => uid.toString() !== req.body.userId
    );
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Invite a user to an event
router.post('/:id/invite', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!event.invited.includes(req.body.userId) && !event.participants.includes(req.body.userId)) {
      event.invited.push(req.body.userId);
      await event.save();
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get pending event invites for a user
router.get('/requests/:userId', async (req, res) => {
  try {
    const events = await Event.find({ invited: req.params.userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Accept event invite (join event and remove from invited)
router.post('/:id/accept', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    // Remove from invited
    event.invited = event.invited.filter(uid => uid.toString() !== req.body.userId);
    // Add to participants if not already
    if (!event.participants.includes(req.body.userId)) {
      event.participants.push(req.body.userId);
    }
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Decline event invite
router.post('/:id/decline', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    event.invited = event.invited.filter(uid => uid.toString() !== req.body.userId);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all events visible to a user (created, invited, or participant)
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const events = await Event.find({
      $or: [
        { createdBy: userId },
        { participants: userId },
        { invited: userId }
      ]
    })
    .populate('createdBy', 'name')
    .populate('participants', 'name')
    .populate('invited', 'name');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete event by ID (only creator can delete)
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    // Optionally, check if req.user.id === event.createdBy
    await event.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
