import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box, CircularProgress, Chip } from '@mui/material';

function RepositoryDetail() {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/repository/${id}`)
      .then(res => res.json())
      .then(data => {
        setRepo(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>;
  if (!repo) return <Box mt={6}><Typography color="error">Repository not found.</Typography></Box>;

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mt: 6 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {repo.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Uploaded by {repo.owner?.name || 'Unknown'}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
          {repo.description}
        </Typography>
        <Box sx={{ mb: 2 }}>
          {repo.tags && repo.tags.map((tag, idx) => (
            <Chip key={idx} label={tag} sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>
        {repo.filePath && (
          <a
            href={`http://localhost:5000/${repo.filePath.replace(/\\/g, '/')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Typography color="primary" fontWeight={600}>
              Download File
            </Typography>
          </a>
        )}
      </Paper>
    </Container>
  );
}

export default RepositoryDetail;