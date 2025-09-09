const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // accepted
  invited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],     // pending
  type: { type: String, enum: ['conference', 'seminar', 'workshop', 'deadline', 'other'], default: 'other' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);