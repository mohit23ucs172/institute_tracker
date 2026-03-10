const Committee = require('../models/Committee');

// @desc    Create a new committee
// @route   POST /api/committees
// @access  Private (Admin only)
exports.createCommittee = async (req, res) => {
  try {
    const { committee_name, description } = req.body;

    // Check if committee already exists
    const existing = await Committee.findOne({ committee_name });
    if (existing) {
      return res.status(400).json({ message: "Committee already exists" });
    }

    const committee = new Committee({
      committee_name,
      description
    });

    await committee.save();
    res.status(201).json(committee);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc    Get all committees
// @route   GET /api/committees
// @access  Private
exports.getCommittees = async (req, res) => {
  try {
    const committees = await Committee.find();
    res.json(committees);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};