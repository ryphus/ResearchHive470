import React from 'react';
import { useNavigate } from 'react-router-dom';
import Notifications from './Notifications';
import { AppBar, Toolbar, Typography, Button, Box, Divider } from '@mui/material';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            color="inherit"
            sx={{ letterSpacing: 2, cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            Research Hive
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: '#fff' }} />
          {user && (
            <Typography
              variant="body1"
              color="inherit"
              sx={{
                fontWeight: 600,
                fontSize: '1.1rem',
                px: 2,
                py: 0.5,
                bgcolor: 'rgba(255,255,255,0.15)',
                borderRadius: 2,
                letterSpacing: 1
              }}
            >
              {user.name}
            </Typography>
          )}
        </Box>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Notifications user={user} />
            <Button color="inherit" onClick={() => navigate('/dashboard')}>
              Home
            </Button>
            <Button color="inherit" onClick={() => navigate('/profile')}>
              Profile
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;