const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load Environment Variables
dotenv.config();

const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});