const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema({
  // 1. The Official Name (e.g., "Senate", "Finance Committee", "Building Works")
  committee_name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true // Removes accidental leading/trailing spaces
  },

  // 2. A brief description of what this committee does
  description: { 
    type: String,
    default: "Official Institute Committee"
  },

  // 3. Status (Optional: to disable a committee without deleting its records)
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
});

// We create an index on the name for faster searching in the dashboard

module.exports = mongoose.model('Committee', committeeSchema);