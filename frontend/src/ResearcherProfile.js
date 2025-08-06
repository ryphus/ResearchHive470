import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function ResearcherProfile() {
  // 
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [publications, setPublications] = useState('');
  const [projects, setProjects] = useState('');
  const [affiliations, setAffiliations] = useState('');
  const [contact, setContact] = useState('');
  const [editMode, setEditMode] = useState(false);

  // local je storage ta ase
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('researcherProfile'));
    if (savedProfile) {
      setBio(savedProfile.bio || '');
      setInterests(savedProfile.interests || '');
      setPublications(savedProfile.publications || '');
      setProjects(savedProfile.projects || '');
      setAffiliations(savedProfile.affiliations || '');
      setContact(savedProfile.contact || '');
    }
  }, []);

  // Save profile to localStorage
  const handleSave = (e) => {
    e.preventDefault();
    const profileData = { bio, interests, publications, projects, affiliations, contact };
    localStorage.setItem('researcherProfile', JSON.stringify(profileData));
    setEditMode(false);
  };

  return (
    <Container maxWidth="md">
      <Box mt={8} component={Paper} elevation={6} p={6} borderRadius={4} sx={{ background: '#fff' }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Researcher Profile
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/home"
              sx={{ fontWeight: 600 }}
            >
              Home
            </Button>
          </Grid>
        </Grid>
        {editMode ? (
          <form onSubmit={handleSave}>
            <TextField
              label="Biography"
              multiline
              rows={3}
              fullWidth
              margin="normal"
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
            <TextField
              label="Research Interests"
              fullWidth
              margin="normal"
              value={interests}
              onChange={e => setInterests(e.target.value)}
            />
            <TextField
              label="Publications"
              fullWidth
              margin="normal"
              value={publications}
              onChange={e => setPublications(e.target.value)}
            />
            <TextField
              label="Projects"
              fullWidth
              margin="normal"
              value={projects}
              onChange={e => setProjects(e.target.value)}
            />
            <TextField
              label="Affiliations"
              fullWidth
              margin="normal"
              value={affiliations}
              onChange={e => setAffiliations(e.target.value)}
            />
            <TextField
              label="Contact Info"
              fullWidth
              margin="normal"
              value={contact}
              onChange={e => setContact(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3, fontWeight: 600 }}
            >
              Save Profile
            </Button>
          </form>
        ) : (
          <Box>
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>Biography:</Typography>
            <Typography variant="body1">{bio || <span style={{color:'#aaa'}}>No biography added.</span>}</Typography>
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>Research Interests:</Typography>
            <Typography variant="body1">{interests || <span style={{color:'#aaa'}}>No interests added.</span>}</Typography>
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>Publications:</Typography>
            <Typography variant="body1">{publications || <span style={{color:'#aaa'}}>No publications added.</span>}</Typography>
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>Projects:</Typography>
            <Typography variant="body1">{projects || <span style={{color:'#aaa'}}>No projects added.</span>}</Typography>
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>Affiliations:</Typography>
            <Typography variant="body1">{affiliations || <span style={{color:'#aaa'}}>No affiliations added.</span>}</Typography>
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>Contact Info:</Typography>
            <Typography variant="body1">{contact || <span style={{color:'#aaa'}}>No contact info added.</span>}</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 4, fontWeight: 600 }}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default ResearcherProfile;