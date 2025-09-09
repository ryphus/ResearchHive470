// //basic index js create kore felsi 
// for all the routes and server setup ba routing er jonno 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
// // Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to ResearchHive API!');
});

// Connect to MongoDB (dorkar onujayi url update kore nite hobe)
mongoose.connect('mongodb://localhost:27017/researchhive', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));



// Import and use auth routes
//ekhaen shob gula route dicchi
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const forumRoutes = require('./routes/forum');
app.use('/api/forum', forumRoutes);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

const connectionsRoutes = require('./routes/connections');
app.use('/api/connections', connectionsRoutes);

app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);

const bookmarkRoutes = require('./routes/bookmarks');
app.use('/api/bookmarks', bookmarkRoutes);

const repositoryRoutes = require('./routes/repository');
app.use('/api/repository', repositoryRoutes);

const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);

const projectRoutes = require('./routes/projects');
app.use('/api/projects', projectRoutes);







// const forumRoutes = require('./routes/forum'); //eta hocche dashboard e dekhanor jonno forum post
// app.use('/api/forum', forumRoutes);

// // So jate refresh works for all pages
// app.use(express.static(path.join(__dirname, '../frontend/build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log("✅ MongoDB Connected"))
// .catch(err => console.error("❌ Connection error:", err));

// app.get("/", (req, res) => {
//     res.send("Backend is running!");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server is running on port ${PORT}`);
// });
