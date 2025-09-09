import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, CardActionArea, Button, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const features = [
  {
    title: 'Profile',
    description: 'Edit your biography, interests, and research info.',
    color: 'primary',
    to: '/profile'
  },
  {
    title: 'Repository',
    description: 'Upload and manage your research files.',
    color: 'success',
    to: '/repository'
  },
  {
    title: 'Forum',
    description: 'Discuss ideas and issues with researchers.',
    color: 'info',
    to: '/forum'
  },
  {
    title: 'Connections',
    description: 'Find and connect with other researchers.',
    color: 'secondary',
    to: '/connections'
  },
  {
    title: 'Bookmarks',
    description: 'See all your bookmarked forum posts and repositories.',
    color: 'warning',
    to: '/bookmarks'
  },
  {
    title: 'Events',
    description: 'Track research events and deadlines.',
    color: 'secondary',
    to: '/events'
  },
  {
    title: 'Projects',
    description: 'Create solo or collaborative research projects.',
    color: 'info',
    to: '/projects'
  }
  // Add more features here as needed
];

function Home({ user }) {
  const [latestPosts, setLatestPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/forum/latest-by-connections/${user.id}`)
      .then(res => res.json())
      .then(data => setLatestPosts(data))
      .catch(() => setLatestPosts([]));
  }, [user]);

  return (
    <Container maxWidth="xl">
      <Box mt={6} mb={2}>
        <Typography variant="h4" fontWeight={700} align="center" gutterBottom sx={{ letterSpacing: 2 }}>
          Welcome to <span style={{ color: '#1976d2' }}>Research Hive</span>
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Research, Collaboration, ebong Innovation er jonno ektu professional platform
        </Typography>
      </Box>
      <Box sx={{ px: 2, py: 3, bgcolor: '#f5f7fa', borderRadius: 3, mb: 4 }}>
        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 3,
                  height: '100%',
                  transition: '0.2s',
                  bgcolor: '#fff',
                  '&:hover': { boxShadow: 6, borderColor: '#1976d2' }
                }}
              >
                <CardActionArea component={RouterLink} to={feature.to}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h6" fontWeight={700} color={feature.color} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                      {feature.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      color={feature.color}
                      size="medium"
                      sx={{ mt: 2, fontWeight: 600, px: 3, borderRadius: 2 }}
                    >
                      Explore
                    </Button>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Box>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
          Latest Forum Posts from Your Connections
        </Typography>
        <Grid container direction="column" spacing={2}>
          {latestPosts.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary">No recent posts from your connections.</Typography>
            </Grid>
          ) : (
            latestPosts.map(post => (
              <Grid item xs={12} key={post._id}>
                <Card elevation={2} sx={{ borderRadius: 3, mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {post.content.length > 80 ? post.content.slice(0, 80) + '...' : post.content}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      By {post.author}
                    </Typography>
                  </CardContent>
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      fullWidth
                      component={RouterLink}
                      to={`/forum/${post._id}`}
                      sx={{ borderRadius: 2, mt: 1 }}
                    >
                      View Post
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default Home;