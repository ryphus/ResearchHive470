import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Paper, TextField, Button, Chip, Divider, Alert
} from '@mui/material';

function Forum() {
  const [posts, setPosts] = useState([]);
  const [type, setType] = useState('idea');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState({});
  
  const [user, setUser] = useState('demoUser'); // ekhane real user ditey hobe

  useEffect(() => {
    fetch('http://localhost:5000/api/forum')
      .then(res => res.json())
      .then(setPosts);
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const res = await fetch('http://localhost:5000/api/forum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, title, content, author: user })
    });
    const data = await res.json();
    if (res.ok) {
      setPosts([data, ...posts]);
      setTitle('');
      setContent('');
      setMessage('Posted!');
    } else {
      setError(data.error || 'Error posting');
    }
  };

  const handleLike = async (id) => {
    const res = await fetch(`http://localhost:5000/api/forum/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    });
    const data = await res.json();
    setPosts(posts.map(p => p._id === id ? data : p));
  };

  const handleComment = async (id) => {
    const text = commentText[id];
    if (!text) return;
    const res = await fetch(`http://localhost:5000/api/forum/${id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, text })
    });
    const data = await res.json();
    setPosts(posts.map(p => p._id === id ? data : p));
    setCommentText({ ...commentText, [id]: '' });
  };

  return (
    <Container maxWidth="md">
      <Box mt={6} mb={6}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} mb={2}>Forum</Typography>
          <Divider sx={{ mb: 3 }} />
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handlePost}>
            <Box display="flex" gap={2} mb={2}>
              <Button
                variant={type === 'idea' ? 'contained' : 'outlined'}
                onClick={() => setType('idea')}
              >Idea</Button>
              <Button
                variant={type === 'issue' ? 'contained' : 'outlined'}
                onClick={() => setType('issue')}
              >Issue</Button>
            </Box>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={3}
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              margin="normal"
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Post</Button>
          </form>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" mb={2}>Posts</Typography>
          {posts.map(post => (
            <Paper key={post._id} sx={{ mb: 3, p: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip label={post.type} color={post.type === 'idea' ? 'primary' : 'secondary'} />
                <Typography variant="subtitle1" fontWeight={600}>{post.title}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                  {post.author} • {new Date(post.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" mt={1}>{post.content}</Typography>
              <Box display="flex" alignItems="center" gap={2} mt={2}>
                <Button size="small" onClick={() => handleLike(post._id)}>
                  👍 {post.likes.length}
                </Button>
                <TextField
                  size="small"
                  placeholder="Add comment"
                  value={commentText[post._id] || ''}
                  onChange={e => setCommentText({ ...commentText, [post._id]: e.target.value })}
                  sx={{ width: 200 }}
                />
                <Button size="small" onClick={() => handleComment(post._id)}>Comment</Button>
              </Box>
              <Box mt={2}>
                {post.comments.map((c, i) => (
                  <Paper key={i} sx={{ p: 1, mb: 1, bgcolor: '#f5f5f5' }}>
                    <Typography variant="caption" fontWeight={600}>{c.user}</Typography>
                    <Typography variant="body2">{c.text}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(c.date).toLocaleString()}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Paper>
          ))}
          {posts.length === 0 && (
            <Typography variant="body2" color="text.secondary">No posts yet.</Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default Forum;