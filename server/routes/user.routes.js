const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { verifyToken, adminOnly } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all personnel for the Admin list
router.get('/', verifyToken, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('assignedCommittees');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// @route   POST /api/users/register
// @desc    Admin adds a new Director or Viewer
router.post('/register', verifyToken, adminOnly, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name, email, password: hashedPassword, role, assignedCommittees: []
    });

    await newUser.save();
    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

// @route   POST /api/users/assign
// @desc    Assign a committee to a specific user
router.post('/assign', verifyToken, adminOnly, async (req, res) => {
  const { userId, committeeId } = req.body;
  try {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { assignedCommittees: committeeId }
    });
    res.json({ message: "Access granted" });
  } catch (err) {
    res.status(500).json({ message: "Assignment failed" });
  }
});

module.exports = router;