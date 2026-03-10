const User = require('../models/User'); // MISSING IN YOUR CODE - MUST BE HERE
const Committee = require('../models/Committee');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 1. REGISTER A NEW USER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, assignedCommittees } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Viewer', // Default to viewer for security
      assignedCommittees: assignedCommittees || []
    });

    res.status(201).json({ 
      success: true, 
      message: "Authorized account created successfully" 
    });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// 2. LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // IMPORTANT: Added .populate() here so the frontend gets Committee Names immediately
    const user = await User.findOne({ email }).populate('assignedCommittees');
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      // Ensure JWT_SECRET is actually defined in your .env
      if (!process.env.JWT_SECRET) {
        console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
        return res.status(500).json({ message: "Server configuration error" });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      console.log(`✅ User ${user.email} logged in with ${user.assignedCommittees.length} committees`);

      res.status(200).json({
        token,
        name: user.name,
        role: user.role,
        // Frontend now gets [{ _id, committee_name }, ...]
        assignedCommittees: user.assignedCommittees 
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// 3. GET CURRENT USER PROFILE
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('assignedCommittees'); 
    
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: "Access Denied: Admin privileges required" });
  }
};