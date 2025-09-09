import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Paper, CircularProgress, Button, TextField, Stack, Avatar, Divider } from '@mui/material';

function ForumPostDetail({ user }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/forum/${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/bookmarks/user/${user.id}/type/forum`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(b => b.item === post?._id);
        if (found) {
          setBookmarked(true);
          setBookmarkId(found._id);
        } else {
          setBookmarked(false);
          setBookmarkId(null);
        }
      });
  }, [user, post?._id]);

  const handleLike = async () => {
    if (!user || likeLoading) return;
    setLikeLoading(true);
    await fetch(`http://localhost:5000/api/forum/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, userName: user.name })
    });
    // Refresh post data
    fetch(`http://localhost:5000/api/forum/${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLikeLoading(false);
      });
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !comment.trim() || commentLoading) return;
    setCommentLoading(true);
    await fetch(`http://localhost:5000/api/forum/${id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, userName: user.name, text: comment })
    });
    setComment('');
    // Refresh post data
    fetch(`http://localhost:5000/api/forum/${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setCommentLoading(false);
      });
  };

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

  if (loading) return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>;
  if (!post) return <Box mt={6}><Typography color="error">Post not found.</Typography></Box>;

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mt: 6 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          By {post.author}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {post.content}
        </Typography>
        <Box sx={{ mt: 3, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant={post.likes && post.likes.includes(user?.id) ? 'contained' : 'outlined'}
            color="primary"
            onClick={handleLike}
            disabled={likeLoading || !user}
          >
            Like {post.likes ? `(${post.likes.length})` : ''}
          </Button>
          <Button
            variant={bookmarked ? 'contained' : 'outlined'}
            color="warning"
            onClick={handleBookmark}
          >
            {bookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Comments
        </Typography>
        <Box component="form" onSubmit={handleComment} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Add a comment"
              value={comment}
              onChange={e => setComment(e.target.value)}
              size="small"
              fullWidth
              disabled={!user || commentLoading}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!user || commentLoading || !comment.trim()}
            >
              Post
            </Button>
          </Stack>
        </Box>
        <Stack spacing={2}>
          {post.comments && post.comments.length === 0 && (
            <Typography color="text.secondary">No comments yet.</Typography>
          )}
          {post.comments && post.comments.map((c, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', color: '#fff' }}>
                {c.userName ? c.userName[0].toUpperCase() : ''}
              </Avatar>
              <Box>
                <Typography fontWeight={600}>{c.userName}</Typography>
                <Typography variant="body2" color="text.secondary">{c.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(c.date).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
}

export default ForumPostDetail;