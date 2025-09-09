const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// Create project
router.post('/', async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      owner: req.body.owner,
      collaborators: [req.body.owner] // Owner is always a collaborator
    });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all projects visible to a user (owner, collaborator, or invited)
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const projects = await Project.find({
      $or: [
        { owner: userId },
        { collaborators: userId },
        { invited: userId }
      ]
    })
    .populate('owner', 'name')
    .populate('collaborators', 'name')
    .populate('invited', 'name');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name')
      .populate('collaborators', 'name')
      .populate('invited', 'name');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Invite user to collaborate
router.post('/:id/invite', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.invited.includes(req.body.userId) && !project.collaborators.includes(req.body.userId)) {
      project.invited.push(req.body.userId);
      await project.save();

      // Notify the invited user
      await Notification.create({
        user: req.body.userId,
        message: `You have been invited to collaborate on the project "${project.title}".`
      });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Accept collaboration invite
router.post('/:id/accept', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    // Remove from invited
    project.invited = project.invited.filter(uid => uid.toString() !== req.body.userId);
    // Add to collaborators if not already
    if (!project.collaborators.includes(req.body.userId)) {
      project.collaborators.push(req.body.userId);
    }
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Decline collaboration invite
router.post('/:id/decline', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.invited = project.invited.filter(uid => uid.toString() !== req.body.userId);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete project (only owner)
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    // Optionally, check if req.user.id === project.owner
    await project.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;