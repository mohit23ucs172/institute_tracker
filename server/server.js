const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load Environment Variables
dotenv.config();

const app = express();

// 2. Middleware
app.use(cors());
// In server.js
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain.vercel.app'],
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));

// 3. Import Routes
const authRoutes = require('./routes/auth.routes');
const documentRoutes = require('./routes/document.routes');
const committeeRoutes = require('./routes/committee.routes'); // NEW: For Admin Panel
const userRoutes = require('./routes/user.routes');           // NEW: For Admin to see users

// 4. Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/committees', committeeRoutes); // Register Committee routes
app.use('/api/users', userRoutes);  
app.use('/api/auth', authRoutes);  
         // Register User management routes

// 5. Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/institute_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Institute MongoDB Connected');
    console.log('📂 Relational Logic Active: [Committees] -> [Meetings] -> [Documents]');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// 6. Global Error Handler (Prevents server crash on bad requests)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// 7. Root Route for Testing
app.get('/', (req, res) => {
  res.send('Institute Document Tracker API is Running...');
});

// 8. Start Server
// ... all your routes and middleware above

// VERCEL FIX: Check environment to decide how to run the app
if (process.env.NODE_ENV !== 'production') {
  // RUNS LOCALLY (e.g., nodemon server.js)
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Development server running on http://localhost:${PORT}`);
  });
}

// EXPORT FOR VERCEL (Serverless Function)
module.exports = app;