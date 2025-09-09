const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
  filePath: String, // for local file storage
  fileName: String, // original file name
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Repository', repositorySchema);