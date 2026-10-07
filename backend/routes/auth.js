const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hardcoded users (replace with MongoDB User model for production)
const USERS = [
  {
    id: '1',
    username: 'admin',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // admin123
    role: 'admin',
    name: 'Lab Administrator'
  },
  {
    id: '2',
    username: 'teacher',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // teacher123 (hashed)
    role: 'teacher',
    name: 'Faculty Member'
  },
  {
    id: '3',
    username: 'student',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // student123
    role: 'student',
    name: 'Student User'
  }
];

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    // Demo auth: accept plain passwords matching the demo credentials
    const demoCreds = {
      admin:   { pass: 'admin123',   role: 'admin',   name: 'Lab Administrator' },
      teacher: { pass: 'teacher123', role: 'teacher', name: 'Faculty Member' },
      student: { pass: 'student123', role: 'student', name: 'Student User' }
    };

    const cred = demoCreds[username];
    if (!cred || password !== cred.pass || (role && role !== cred.role)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { username, role: cred.role, name: cred.name },
      process.env.JWT_SECRET || 'labos_secret_key',
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { username, role: cred.role, name: cred.name }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/verify  — validate a token
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'labos_secret_key');
    res.json({ success: true, data: decoded });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // With JWT, client just deletes the token
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
