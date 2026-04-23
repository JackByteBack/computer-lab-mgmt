const express = require('express');
const router = express.Router();
const {
  getAllSessions,
  login,
  logout,
  getTopUsers,
  getDailyStats
} = require('../controllers/usageController');

router.get('/top-users', getTopUsers);
router.get('/daily-stats', getDailyStats);
router.get('/', getAllSessions);
router.post('/login', login);
router.post('/logout/:sessionId', logout);

module.exports = router;
