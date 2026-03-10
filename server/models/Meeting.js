const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  // Link this meeting to a specific Committee ID
  committee_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Committee', 
    required: true 
  },
  meeting_number: { type: String, required: true },
  date: { type: String, required: true },
  agenda_count: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Approved', 'Pending'], default: 'Approved' }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);