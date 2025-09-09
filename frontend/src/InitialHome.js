import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper } from '@mui/material';

function InitialHome() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box mt={10} component={Paper} elevation={6} p={5} borderRadius={4} sx={{ background: '#fff' }}>
        <Typography variant="h3" fontWeight={700} gutterBottom align="center">
          Research Hive
        </Typography>
        <Typography variant="h6" color="textSecondary" align="center" gutterBottom>
          An online platform for researchers to connect, share, and collaborate.
        </Typography>
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default InitialHome;