import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import ResearcherProfile from './ResearcherProfile'; // still construction er modeddhe ase eita

import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

function Register() {
  const [username, setUsername] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [agree, setAgree] = React.useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!agree) {
      setError('You must agree to the Terms of service');
      return;
    }

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, name, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage('Registration successful!');
      setUsername('');
      setName('');
      setEmail('');
      setPassword('');
      setAgree(false);
    } else {
      setError(data.message || 'Registration failed');
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
          ResearchHive Registration
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
          />
          <TextField
            label="Your Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <TextField
            label="Your Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
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
          <FormControlLabel
            control={
              <Checkbox
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                required
              />
            }
            label={
              <span>
                I agree all statements in{' '}
                <Link to="/login" style={{ textDecoration: 'underline', color: '#1976d2', cursor: 'pointer' }}>
                  Terms of service
                </Link>
              </span>
            }
            sx={{ mt: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2, mb: 1, py: 1.5, fontWeight: 600, fontSize: '1rem' }}
          >
            Register
          </Button>
          <Box textAlign="center" mt={2}>
            <Link to="/login" style={{ textDecoration: 'underline', color: '#1976d2', cursor: 'pointer' }}>
              I am already member
            </Link>
          </Box>
          {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </form>
      </Box>
    </Container>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ResearcherProfile />} />
      </Routes>
    </Router>
  );
}

export default App;