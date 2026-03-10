const express = require('express');
const router = express.Router();
const { uploadDocument, getAllDocuments } = require('../controllers/documentController');
const { verifyToken } = require('../middleware/auth');
const multer = require('../middleware/upload');

// POST - Upload a new document
router.post('/', verifyToken, multer.single('file'), uploadDocument);

// GET - Get all documents for the Reports page (NEW)
router.get('/', verifyToken, getAllDocuments);

module.exports = router;