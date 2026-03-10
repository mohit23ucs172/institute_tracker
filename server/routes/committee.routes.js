// server/routes/committee.routes.js
const express = require('express');
const router = express.Router();
const { createCommittee, getCommittees } = require('../controllers/committeeController');
const { verifyToken, adminOnly } = require('../middleware/auth');

router.get('/', verifyToken, getCommittees);
router.post('/', verifyToken, adminOnly, createCommittee);

module.exports = router;