const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Connection', connectionSchema);






//egula thakuk
// //const mongoose = require('mongoose');

// const connectionSchema = new mongoose.Schema({
//   requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Connection', connectionSchema);