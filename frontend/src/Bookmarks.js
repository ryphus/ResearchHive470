import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Grid, Divider, CircularProgress, Tabs, Tab, Card, CardContent, CardActions } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Bookmarks({ user }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forumDetails, setForumDetails] = useState({});
  const [repoDetails, setRepoDetails] = useState({});
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/bookmarks/${user.id}`)
      .then(res => res.json())
      .then(async (data) => {
        setBookmarks(data);
        // Fetch details for each bookmark
        const forumIds = data.filter(b => b.type === 'forum').map(b => b.item);
        const repoIds = data.filter(b => b.type === 'repository').map(b => b.item);

        // Fetch forum post details
        const forumDetailsObj = {};
        for (const id of forumIds) {
          try {
            const res = await fetch(`http://localhost:5000/api/forum/${id}`);
            if (res.ok) {
              const post = await res.json();
              forumDetailsObj[id] = post;
            }
          } catch {}
        }
        setForumDetails(forumDetailsObj);

        // Fetch repository details
        const repoDetailsObj = {};
        for (const id of repoIds) {
          try {
            const res = await fetch(`http://localhost:5000/api/repository/${id}`);
            if (res.ok) {
              const repo = await res.json();
              repoDetailsObj[id] = repo;
            }
          } catch {}
        }
        setRepoDetails(repoDetailsObj);

        setLoading(false);
      });
  }, [user]);

  const handleRemove = async (bookmarkId) => {
    await fetch(`http://localhost:5000/api/bookmarks/${bookmarkId}`, { method: 'DELETE' });
    setBookmarks(bookmarks.filter(b => b._id !== bookmarkId));
  };

  const forumBookmarks = bookmarks.filter(b => b.type === 'forum');
  const repoBookmarks = bookmarks.filter(b => b.type === 'repository');

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="md" mx="auto" mt={6}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Your Bookmarks
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label={`Forum Posts (${forumBookmarks.length})`} />
          <Tab label={`Repositories (${repoBookmarks.length})`} />
        </Tabs>
        {tab === 0 && (
          <Grid container spacing={2}>
            {forumBookmarks.length === 0 && (
              <Grid item xs={12}>
                <Typography color="text.secondary">No forum bookmarks yet.</Typography>
              </Grid>
            )}
            {forumBookmarks.map(b => (
              <Grid item xs={12} sm={6} key={b._id}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography fontWeight={600} gutterBottom>
                      {forumDetails[b.item]?.title || 'Loading...'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {(forumDetails[b.item]?.content || '').slice(0, 80)}...
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ mt: 'auto', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      component={RouterLink}
                      to={`/forum/${b.item}`}
                      target="_blank"
                    >
                      View Post
                    </Button>
                    <Button color="error" variant="outlined" size="small" onClick={() => handleRemove(b._id)}>
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        {tab === 1 && (
          <Grid container spacing={2}>
            {repoBookmarks.length === 0 && (
              <Grid item xs={12}>
                <Typography color="text.secondary">No repository bookmarks yet.</Typography>
              </Grid>
            )}
            {repoBookmarks.map(b => (
              <Grid item xs={12} sm={6} key={b._id}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography fontWeight={600} gutterBottom>
                      {repoDetails[b.item]?.title || 'Loading...'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {(repoDetails[b.item]?.description || '').slice(0, 80)}...
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ mt: 'auto', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      component={RouterLink}
                      to={`/repository/${b.item}`}
                      target="_blank"
                    >
                      View Repository
                    </Button>
                    <Button color="error" variant="outlined" size="small" onClick={() => handleRemove(b._id)}>
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}

export default Bookmarks;