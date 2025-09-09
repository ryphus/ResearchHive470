import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Paper, Alert
} from '@mui/material';

function Register({ onRegister }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      onRegister(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} component={Paper} elevation={6} p={5} borderRadius={4} sx={{ background: '#fff' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom align="center">
          Register
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            name="email"
            type="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, fontWeight: 600 }}
          >
            Register
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          Already a user?{' '}
          <Button variant="text" onClick={() => navigate('/login')}>
            Log in
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;