import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Paper, TextField, Button, Chip, Divider, Alert, Stack
} from '@mui/material';

function Forum({ user }) {
  const [posts, setPosts] = useState([]);
  const [type, setType] = useState('idea');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/forum')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title,
          content,
          author: user.name,
          authorId: user.id
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error posting');
        return;
      }
      setPosts([data, ...posts]);
      setTitle('');
      setContent('');
      setMessage('Posted!');
    } catch (err) {
      setError('Network error');
    }
  };

  const handleEdit = (post) => {
    setEditId(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleEditSave = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/forum/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: editTitle,
          content: editContent
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error editing post');
        return;
      }
      setPosts(posts.map(p => p._id === id ? data : p));
      setEditId(null);
      setMessage('Post updated!');
    } catch (err) {
      setError('Network error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/forum/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error deleting post');
        return;
      }
      setPosts(posts.filter(p => p._id !== id));
      setMessage('Post deleted!');
    } catch (err) {
      setError('Network error');
    }
  };

  const handleLike = async (id) => {
    const res = await fetch(`http://localhost:5000/api/forum/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, userName: user.name })
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
      body: JSON.stringify({ userId: user.id, userName: user.name, text })
    });
    const data = await res.json();
    setPosts(posts.map(p => p._id === id ? data : p));
    setCommentText({ ...commentText, [id]: '' });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Forum Post Form */}
      <Paper elevation={4} sx={{ p: 5, borderRadius: 4, width: '100%', mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Create a Post
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        <form onSubmit={handlePost}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <TextField
              select
              SelectProps={{ native: true }}
              label="Type"
              value={type}
              onChange={e => setType(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <option value="idea">Idea</option>
              <option value="issue">Issue</option>
            </TextField>
            <TextField
              label="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              fullWidth
            />
          </Stack>
          <TextField
            label="Description"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            multiline
            rows={4}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ fontWeight: 600 }}>
            Post
          </Button>
        </form>
      </Paper>

      {/* Forum Posts List */}
      <Paper elevation={4} sx={{ p: 5, borderRadius: 4, width: '100%', bgcolor: '#f9f9f9' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Forum Posts
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {loading ? (
          <Typography>Loading...</Typography>
        ) : posts.length === 0 ? (
          <Typography color="text.secondary">No posts yet.</Typography>
        ) : (
          <Stack spacing={3}>
            {posts.map(post => (
              <Paper key={post._id} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff' }} elevation={2}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Chip label={post.type} color={post.type === 'idea' ? 'primary' : 'secondary'} size="small" />
                    <Typography variant="h6" sx={{ ml: 1, display: 'inline' }}>{post.title}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 2, display: 'inline' }}>
                      by {post.author}
                    </Typography>
                  </Box>
                  {post.authorId === user.id && (
                    <Box>
                      <Button size="small" onClick={() => handleEdit(post)}>Edit</Button>
                      <Button size="small" color="error" onClick={() => handleDelete(post._id)}>Delete</Button>
                    </Box>
                  )}
                </Box>
                {editId === post._id ? (
                  <Box>
                    <TextField
                      label="Title"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      sx={{ mt: 1, mr: 1 }}
                    />
                    <TextField
                      label="Content"
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      sx={{ mt: 1, mr: 1 }}
                    />
                    <Button variant="contained" size="small" onClick={() => handleEditSave(post._id)} sx={{ mt: 1, mr: 1 }}>
                      Save
                    </Button>
                    <Button variant="outlined" size="small" onClick={() => setEditId(null)} sx={{ mt: 1 }}>
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <Typography sx={{ mt: 1 }}>{post.content}</Typography>
                )}
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
                  <ForumPostCard post={post} user={user} />
                </Box>
                <Box mt={2}>
                  {post.comments.map((c, i) => (
                    <Paper key={i} sx={{ p: 1, mb: 1, bgcolor: '#f5f5f5' }}>
                      <Typography variant="caption" fontWeight={600}>{c.userName || c.user}</Typography>
                      <Typography variant="body2">{c.text}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {c.date ? new Date(c.date).toLocaleString() : ''}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Container>
  );
}

function ForumPostCard({ post, user }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/bookmarks/user/${user.id}/type/forum`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(b => b.item === post._id);
        if (found) {
          setBookmarked(true);
          setBookmarkId(found._id);
        } else {
          setBookmarked(false);
          setBookmarkId(null);
        }
      });
  }, [user, post._id]);

  const handleBookmark = async () => {
    if (!user) return;
    if (bookmarked && bookmarkId) {
      // Unbookmark
      await fetch(`http://localhost:5000/api/bookmarks/${bookmarkId}`, { method: 'DELETE' });
      setBookmarked(false);
      setBookmarkId(null);
    } else {
      // Bookmark
      const res = await fetch('http://localhost:5000/api/bookmarks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user.id, type: 'forum', item: post._id })
      });
      const data = await res.json();
      setBookmarked(true);
      setBookmarkId(data._id);
    }
  };

  return (
    <Button
      variant={bookmarked ? 'contained' : 'outlined'}
      color="warning"
      onClick={handleBookmark}
    >
      {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </Button>
  );
}

export default Forum;