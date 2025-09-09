import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Button, Box, Modal, TextField, List, ListItem, ListItemText, Divider, Chip, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Projects({ user }) {
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/projects/user/${user.id}`)
      .then(res => res.json())
      .then(setProjects);
  }, [user.id]);

  const handleInputChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, owner: user.id })
    });
    const data = await res.json();
    setProjects([...projects, data]);
    setModalOpen(false);
    setForm({ title: '', description: '' });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Projects
        </Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setModalOpen(true)}>
          Create Project
        </Button>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Your Projects & Collaborations</Typography>
        {projects.length === 0 && (
          <Typography color="text.secondary">No projects yet.</Typography>
        )}
        <List>
          {projects.map(p => (
            <ListItem key={p._id} button onClick={() => navigate(`/projects/${p._id}`)}>
              <ListItemText
                primary={p.title}
                secondary={p.description}
              />
              <Chip label={p.owner?.name === user.name ? "Owner" : "Collaborator"} color={p.owner?.name === user.name ? "primary" : "success"} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
        }}>
          <Typography variant="h6" mb={2}>Create Project</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title" name="title" value={form.title} onChange={handleInputChange}
              fullWidth required sx={{ mb: 2 }}
            />
            <TextField
              label="Description" name="description" value={form.description} onChange={handleInputChange}
              fullWidth multiline rows={2} sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create
            </Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
}

export default Projects;