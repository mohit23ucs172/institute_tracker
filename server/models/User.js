const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Director', 'Viewer'], default: 'Viewer' },
  assignedCommittees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Committee' }]
});
// At the bottom of server/models/User.js
const User = mongoose.model('User', userSchema);
module.exports = User; // <--- MUST HAVE THIS