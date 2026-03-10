const jwt = require('jsonwebtoken');

/**
 * 1. verifyToken (Previously 'protect')
 * Ensures the user is logged in with a valid JWT
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user data (id, role, etc.) to the request object
    req.user = decoded; 
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

/**
 * 2. adminOnly
 * Ensures the user has the 'Admin' role
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
};

/**
 * 3. isDirector
 * Ensures the user has the 'Director' role
 */
const isDirector = (req, res, next) => {
  if (req.user && req.user.role === 'Director') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Director role required." });
  }
};

// Exporting with the names your routes are expecting
module.exports = { 
  verifyToken, 
  protect: verifyToken, // Alias to prevent "protect is not a function" errors
  adminOnly, 
  isDirector 
};