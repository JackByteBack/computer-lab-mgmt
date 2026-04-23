const UsageSession = require('../models/UsageSession');
const Computer = require('../models/Computer');

// GET /api/usage
exports.getAllSessions = async (req, res) => {
  try {
    const { pcId, active, date } = req.query;
    const filter = {};
    if (pcId) filter.pcId = pcId.toUpperCase();
    if (active !== undefined) filter.active = active === 'true';
    if (date) {
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end = new Date(date); end.setHours(23, 59, 59, 999);
      filter.loginTime = { $gte: start, $lte: end };
    }
    const sessions = await UsageSession.find(filter).sort({ loginTime: -1 }).limit(100);
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/usage/login
exports.login = async (req, res) => {
  try {
    const { pcId, userName, purpose } = req.body;

    // Check if PC is free
    const computer = await Computer.findOne({ pcId: pcId.toUpperCase() });
    if (!computer) return res.status(404).json({ success: false, message: 'PC not found' });
    if (computer.status !== 'free') return res.status(400).json({ success: false, message: `PC is currently ${computer.status}` });

    // Create session
    const session = await UsageSession.create({ pcId: pcId.toUpperCase(), userName, purpose });

    // Update PC status
    await Computer.findOneAndUpdate(
      { pcId: pcId.toUpperCase() },
      { status: 'in-use', currentUser: userName, lastActive: Date.now() }
    );

    res.status(201).json({ success: true, data: session });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// POST /api/usage/logout/:sessionId
exports.logout = async (req, res) => {
  try {
    const session = await UsageSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    if (!session.active) return res.status(400).json({ success: false, message: 'Session already ended' });

    session.logoutTime = new Date();
    await session.save();

    // Free up PC
    await Computer.findOneAndUpdate(
      { pcId: session.pcId },
      { status: 'free', currentUser: null, lastActive: Date.now() }
    );

    res.json({ success: true, data: session, message: `Session ended. Duration: ${session.durationMinutes} minutes` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/usage/top-users
exports.getTopUsers = async (req, res) => {
  try {
    const result = await UsageSession.aggregate([
      { $match: { active: false } },
      { $group: { _id: '$userName', totalMinutes: { $sum: '$durationMinutes' }, sessions: { $sum: 1 } } },
      { $sort: { totalMinutes: -1 } },
      { $limit: 10 }
    ]);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/usage/daily-stats
exports.getDailyStats = async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const result = await UsageSession.aggregate([
      { $match: { loginTime: { $gte: today } } },
      { $group: { _id: { $hour: '$loginTime' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
