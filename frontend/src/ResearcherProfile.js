import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, CircularProgress, Stack, Avatar } from '@mui/material';

function ResearcherProfile({ user }) {
  const [profile, setProfile] = useState({
    name: '', bio: '', interests: '', publications: '', projects: '', affiliations: '', contact: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/user/profile/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setProfile({
          name: data.name || '',
          bio: data.bio || '',
          interests: data.interests || '',
          publications: data.publications || '',
          projects: data.projects || '',
          affiliations: data.affiliations || '',
          contact: data.contact || ''
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile');
        setLoading(false);
      });
  }, [user]);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/user/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error updating profile');
        return;
      }
      setProfile({
        name: data.name || '',
        bio: data.bio || '',
        interests: data.interests || '',
        publications: data.publications || '',
        projects: data.projects || '',
        affiliations: data.affiliations || '',
        contact: data.contact || ''
      });
      setMsg('Profile updated!');
      setEditMode(false);
    } catch {
      setError('Network error');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>;

  return (
    <Box maxWidth="sm" mx="auto" mt={6}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
            {profile.name ? profile.name[0].toUpperCase() : ''}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {profile.name || user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
        {editMode ? (
          <form onSubmit={handleSave}>
            <Stack spacing={2}>
              <TextField label="Name" name="name" value={profile.name} onChange={handleChange} required />
              <TextField label="Bio" name="bio" value={profile.bio} onChange={handleChange} multiline rows={2} />
              <TextField label="Interests" name="interests" value={profile.interests} onChange={handleChange} />
              <TextField label="Publications" name="publications" value={profile.publications} onChange={handleChange} />
              <TextField label="Projects" name="projects" value={profile.projects} onChange={handleChange} />
              <TextField label="Affiliations" name="affiliations" value={profile.affiliations} onChange={handleChange} />
              <TextField label="Contact" name="contact" value={profile.contact} onChange={handleChange} />
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained" color="primary">Save</Button>
                <Button variant="outlined" onClick={() => setEditMode(false)}>Cancel</Button>
              </Stack>
            </Stack>
          </form>
        ) : (
          <Box>
            <Typography><b>Bio:</b> {profile.bio}</Typography>
            <Typography><b>Interests:</b> {profile.interests}</Typography>
            <Typography><b>Publications:</b> {profile.publications}</Typography>
            <Typography><b>Projects:</b> {profile.projects}</Typography>
            <Typography><b>Affiliations:</b> {profile.affiliations}</Typography>
            <Typography><b>Contact:</b> {profile.contact}</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default ResearcherProfile;