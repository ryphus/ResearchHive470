import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// import RepositoryCard from './RepositoryCard'; not using this


function Repository({ user }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tag, setTag] = useState('');
  const [search, setSearch] = useState('');
  const [repos, setRepos] = useState([]);
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  // Fetch repositories from backend on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/repository', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setRepos(data))
      .catch(() => setRepos([]));
  }, []);

  // Add new repository (with file upload)
  const handleAdd = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!file) return setError('Please select a file to upload.');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('tags', tag);
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/repository', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      const newRepo = await response.json();
      setRepos([...repos, newRepo]);
      setTitle('');
      setDesc('');
      setTag('');
      setFile(null);
      fileInputRef.current.value = null;
      setSuccess('File uploaded successfully!');
    } catch (error) {
      setError('Error uploading file');
    }
  };

  // Delete repository
  const handleDelete = async (repo) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    setSuccess('');
    setError('');
    try {
      await fetch(`http://localhost:5000/api/repository/${repo._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRepos(repos.filter(r => r._id !== repo._id));
      setSuccess('File deleted successfully!');
    } catch (error) {
      setError('Error deleting file');
    }
  };

  // Download repository
  const handleDownload = (repo) => {
    window.open(`http://localhost:5000/${repo.filePath}`, '_blank');
  };

  // Search filter
  const filteredRepos = repos.filter(
    r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(r.tags) ? r.tags.join(', ').toLowerCase() : r.tags.toLowerCase()).includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="md">
      <Box mt={6} mb={6}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight={700}>
              Repository
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/home"
              sx={{ fontWeight: 600 }}
            >
              Home
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            label="Search files"
            variant="outlined"
            fullWidth
            margin="normal"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Upload Research
          </Typography>
          <form onSubmit={handleAdd}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={2}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              required
            />
            <TextField
              label="Tags (comma-separated)"
              variant="outlined"
              fullWidth
              margin="normal"
              value={tag}
              onChange={e => setTag(e.target.value)}
              required
            />
            <Box display="flex" alignItems="center" gap={2} mt={2}>
              <Button
                variant="outlined"
                component="label"
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                Choose file
                <input
                  type="file"
                  hidden
                  onChange={e => setFile(e.target.files[0])}
                  ref={fileInputRef}
                />
              </Button>
              <Typography variant="body2" color="text.secondary">
                {file ? file.name : 'No file chosen'}
              </Typography>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3, fontWeight: 600 }}
              fullWidth
            >
              Upload File
            </Button>
          </form>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Uploaded Files
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Title</b></TableCell>
                  <TableCell><b>Description</b></TableCell>
                  <TableCell><b>Tags</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRepos.map(repo => (
                  <TableRow key={repo._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        {repo.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{repo.description}</TableCell>
                    <TableCell>
                      {Array.isArray(repo.tags)
                        ? repo.tags.map((t, i) => <Chip key={i} label={t} size="small" sx={{ mr: 0.5 }} />)
                        : <Chip label={repo.tags} size="small" />}
                    </TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        size="small"
                        sx={{ textTransform: 'none', fontWeight: 600, mr: 1 }}
                        onClick={() => handleDownload(repo)}
                      >
                        Download
                      </Button>
                      <Button
                        color="error"
                        size="small"
                        sx={{ textTransform: 'none', fontWeight: 600, mr: 1 }}
                        onClick={() => handleDelete(repo)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant={repo.bookmarked ? 'contained' : 'outlined'}
                        color="warning"
                        onClick={async () => {
                          if (repo.bookmarked) {
                            // Unbookmark
                            await fetch(`http://localhost:5000/api/bookmarks/${repo.bookmarkId}`, { method: 'DELETE' });
                            setRepos(repos.map(r => r._id === repo._id ? { ...r, bookmarked: false, bookmarkId: null } : r));
                          } else {
                            // Bookmark
                            const res = await fetch('http://localhost:5000/api/bookmarks/', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ user: user.id, type: 'repository', item: repo._id })
                            });
                            const data = await res.json();
                            setRepos(repos.map(r => r._id === repo._id ? { ...r, bookmarked: true, bookmarkId: data._id } : r));
                          }
                        }}
                      >
                        {repo.bookmarked ? 'Bookmarked' : 'Bookmark'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRepos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No files found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

        
          {/* <Divider sx={{ my: 3 }} />    //trial box banaisilam
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            All Repositories
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {repos.map(repo => (
              <RepositoryCard key={repo._id} repo={repo} user={user} />
            ))}
          </Box> */}


        </Paper>
      </Box>
    </Container>
  );
}

export default Repository;