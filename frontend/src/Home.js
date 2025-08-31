import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // eita user session gula clear kore dibe
    navigate('/login');
  };

  return (
    <Container maxWidth="md">
      <Box
        mt={8}
        component={Paper}
        elevation={6}
        p={6}
        borderRadius={4}
        sx={{ background: '#fff' }}
      >
        <Typography variant="h3" fontWeight={700} align="center" gutterBottom>
          Welcome to ResearchHive!
          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/profile"
              sx={{ fontWeight: 600, mr: 2 }}
            >
              Go to Researcher Profile
            </Button>
            <Button
              variant="contained"
              color="success"
              size="large"
              component={RouterLink}
              to="/repository"
              sx={{ fontWeight: 600, ml: 2 }}
            >
              Repository
            </Button>
            <Button
              variant="contained"
              color="info"
              size="large"
              component={RouterLink}
              to="/forum"
              sx={{ fontWeight: 600, ml: 2 }}
            >
              Forum
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              sx={{ fontWeight: 600 }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary">
          You have successfully logged in.
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;