const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  // Link this document to a specific Meeting ID
  meeting_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Meeting', 
    required: true 
  },
  file_path: { type: String, required: true }, // The Cloudinary URL
  file_type: { type: String, default: 'application/pdf' },
  uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  upload_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);