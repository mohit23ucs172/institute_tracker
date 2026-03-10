const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken, adminOnly } = require('../middleware/auth');
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Check if user exists
    const user = await User.findOne({ email }).populate('assignedCommittees');
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    // 2. Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    // 3. Generate Token (Check if SECRET exists)
    if (!process.env.JWT_SECRET) {
      console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
      return res.status(500).json({ message: "Internal Server Configuration Error" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error("Login Error:", err); // This prints the REAL error in your terminal
    res.status(500).json({ message: "Server Error", detail: err.message });
  }
});
// backend/routes/auth.routes.js

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('assignedCommittees');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Sync error" });
  }
});
module.exports = router;