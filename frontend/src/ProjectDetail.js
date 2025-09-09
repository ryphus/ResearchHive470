import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Chip, Avatar, Button, TextField, List, ListItem, ListItemText, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ProjectDetail({ user }) {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [inviteSearch, setInviteSearch] = useState('');
  const [inviteSuggestions, setInviteSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/projects/${id}`)
      .then(res => res.json())
      .then(setProject);
    fetch('http://localhost:5000/api/user/all')
      .then(res => res.json())
      .then(setAllUsers);
  }, [id]);

  // Invite search
  useEffect(() => {
    if (!inviteSearch || !project) {
      setInviteSuggestions([]);
      return;
    }
    const filtered = allUsers.filter(u =>
      (u.name.toLowerCase().includes(inviteSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(inviteSearch.toLowerCase())) &&
      u._id !== user.id &&
      !(project.invited || []).some(i => i._id === u._id) &&
      !(project.collaborators || []).some(c => c._id === u._id)
    );
    setInviteSuggestions(filtered.slice(0, 5));
  }, [inviteSearch, allUsers, user.id, project]);

  const handleInvite = async (userId) => {
    await fetch(`http://localhost:5000/api/projects/${id}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    setProject({
      ...project,
      invited: [...(project.invited || []), { _id: userId }]
    });
    setInviteSearch('');
    setInviteSuggestions([]);
  };

  // Accept/Decline collaboration invite
  const handleAccept = async () => {
    await fetch(`http://localhost:5000/api/projects/${id}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    });
    setProject({
      ...project,
      collaborators: [...(project.collaborators || []), { _id: user.id, name: user.name }],
      invited: (project.invited || []).filter(i => i._id !== user.id)
    });
  };

  const handleDecline = async () => {
    await fetch(`http://localhost:5000/api/projects/${id}/decline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    });
    setProject({
      ...project,
      invited: (project.invited || []).filter(i => i._id !== user.id)
    });
  };

  // Delete project (only owner)
  const handleDelete = async () => {
    await fetch(`http://localhost:5000/api/projects/${id}`, {
      method: 'DELETE'
    });
    navigate('/projects');
  };

  if (!project) return <Box mt={6}><Typography>Loading...</Typography></Box>;

  const isOwner = project.owner?._id === user.id || project.owner === user.id;
  const isInvited = (project.invited || []).some(i => i._id === user.id);
  const isCollaborator = (project.collaborators || []).some(c => c._id === user.id);

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mt: 6 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => navigate('/projects')}
        >
          Back to Projects
        </Button>
        <Typography variant="h4" fontWeight={700}>{project.title}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>{project.description}</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Owner:</Typography>
        <Chip label={project.owner?.name || project.owner} color="primary" sx={{ mb: 2 }} />
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Collaborators:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {(project.collaborators || []).map(c =>
            <Chip key={c._id} label={c.name || c._id} avatar={<Avatar>{(c.name || '').charAt(0).toUpperCase()}</Avatar>} />
          )}
        </Box>
        {isOwner && (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Invite Researchers:</Typography>
            <TextField
              label="Search researchers"
              value={inviteSearch}
              onChange={e => setInviteSearch(e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <List dense>
              {inviteSuggestions.map(u => (
                <ListItem key={u._id} secondaryAction={
                  <Button size="small" variant="contained" onClick={() => handleInvite(u._id)}>
                    Invite
                  </Button>
                }>
                  <ListItemText primary={u.name} secondary={u.email} />
                </ListItem>
              ))}
            </List>
            <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }} onClick={handleDelete}>
              Delete Project
            </Button>
          </>
        )}
        {isInvited && !isCollaborator && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={handleAccept}>
              Accept Collaboration
            </Button>
            <Button variant="outlined" color="error" onClick={handleDecline}>
              Decline
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ProjectDetail;