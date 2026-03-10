const express = require('express');
const router = express.Router();

const { getMeetings, createMeeting } = require('../controllers/meetingController');
const { verifyToken } = require('../middleware/auth'); // Removed isDirector from here
const upload = require('../middleware/upload');

// Get all meetings
router.get('/', verifyToken, getMeetings);

// Upload a new meeting (Notice I removed `isDirector` from the middle here)
router.post('/', verifyToken, upload.single('file'), createMeeting);

module.exports = router;