import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Link,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage('Login successful!');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        navigate('/home');
      }, 1000); // Redirect after 1 second
    } else {
      setError(data.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        mt={8}
        component={Paper}
        elevation={6}
        p={4}
        borderRadius={4}
        sx={{
          background: '#fff',
        }}
      >
        <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
          ResearchHive Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2, mb: 1, py: 1.5, fontWeight: 600, fontSize: '1rem' }}
          >
            Login
          </Button>
          <Box textAlign="center" mt={2}>
            <RouterLink to="/" style={{ textDecoration: 'underline', color: '#1976d2', cursor: 'pointer' }}>
              Don't have an account? Register
            </RouterLink>
          </Box>
          {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </form>
      </Box>
    </Container>
  );
}

export default Login;