import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

//ja ja lage import
import Navbar from './Navbar';
import InitialHome from './InitialHome';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Forum from './Forum';
import Repository from './Repository';
import ResearcherProfile from './ResearcherProfile';
import Connections from './Connections';
import ForumPostDetail from './ForumPostDetail';
import Bookmarks from './Bookmarks';
import RepositoryDetail from './RepositoryDetail';
import Events from './Events';
import Projects from './Projects';
import ProjectDetail from './ProjectDetail';
 
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Restore user from localStorage if present
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    // After successful login/register
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    // ...redirect if needed
  }; //eee

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={!user ? <InitialHome /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register onRegister={handleLogin} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Home user={user} /> : <Navigate to="/" />} />
        <Route path="/forum" element={user ? <Forum user={user} /> : <Navigate to="/" />} />
        <Route path="/repository" element={<Repository user={user} />} />
        <Route path="/profile" element={<ResearcherProfile user={user} setUser={setUser} />} />
        <Route path="/connections" element={user ? <Connections user={user} /> : <Navigate to="/" />} />
        <Route path="/forum/:id" element={<ForumPostDetail user={user} />} />
        <Route path="/bookmarks" element={<Bookmarks user={user} />} />
        <Route path="/repository/:id" element={<RepositoryDetail />} />
        <Route path="/events" element={<Events user={user} />} />
        <Route path="/projects" element={<Projects user={user} />} />
        <Route path="/projects/:id" element={<ProjectDetail user={user} />} />
        
        {/* Add more protected routes as you add features */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;


