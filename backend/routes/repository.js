const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Repository = require('../models/Repository');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// upload er folder create kore neya
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Get all repositories
router.get('/', async (req, res) => {
  const repos = await Repository.find();
  res.json(repos);
});

// Upload new file
router.post('/', upload.single('file'), async (req, res) => {
  const { title, description, tags } = req.body;
  const repo = new Repository({
    title,
    description,
    tags: tags.split(',').map(t => t.trim()),
    filePath: `uploads/${req.file.filename}`,
    fileName: req.file.originalname,
  });
  await repo.save();
  res.json(repo);
});

// Download file
router.get('/download/:id', async (req, res) => {
  const repo = await Repository.findById(req.params.id);
  if (!repo) return res.status(404).send('File not found');
  res.download(path.join(__dirname, '../', repo.filePath), repo.fileName);
});

// Delete file
router.delete('/:id', async (req, res) => {
  const repo = await Repository.findByIdAndDelete(req.params.id);
  if (repo && repo.filePath) {
    fs.unlink(path.join(__dirname, '../', repo.filePath), () => {});
  }
  res.json({ success: true });
});

// Get repository by ID ///bkrmk
router.get('/:id', async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id);
    if (!repo) return res.status(404).json({ message: 'Repository not found' });
    res.json(repo);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching repository' });
  }
}); //bkrmk

module.exports = router;