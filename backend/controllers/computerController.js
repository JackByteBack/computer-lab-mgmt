const Computer = require('../models/Computer');

// GET /api/computers
exports.getAllComputers = async (req, res) => {
  try {
    const { status, lab } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (lab) filter['location.lab'] = lab;

    const computers = await Computer.find(filter).sort({ pcId: 1 });
    res.json({ success: true, count: computers.length, data: computers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/computers/:id
exports.getComputer = async (req, res) => {
  try {
    const computer = await Computer.findOne({ pcId: req.params.id.toUpperCase() });
    if (!computer) return res.status(404).json({ success: false, message: 'Computer not found' });
    res.json({ success: true, data: computer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/computers
exports.createComputer = async (req, res) => {
  try {
    const computer = await Computer.create(req.body);
    res.status(201).json({ success: true, data: computer });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'PC ID already exists' });
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/computers/:id
exports.updateComputer = async (req, res) => {
  try {
    const computer = await Computer.findOneAndUpdate(
      { pcId: req.params.id.toUpperCase() },
      req.body,
      { new: true, runValidators: true }
    );
    if (!computer) return res.status(404).json({ success: false, message: 'Computer not found' });
    res.json({ success: true, data: computer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/computers/:id
exports.deleteComputer = async (req, res) => {
  try {
    const computer = await Computer.findOneAndDelete({ pcId: req.params.id.toUpperCase() });
    if (!computer) return res.status(404).json({ success: false, message: 'Computer not found' });
    res.json({ success: true, message: `${computer.pcId} deleted successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/computers/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status, currentUser } = req.body;
    const update = { status, lastActive: Date.now() };
    if (status !== 'in-use') update.currentUser = null;
    else update.currentUser = currentUser || 'Unknown';

    const computer = await Computer.findOneAndUpdate(
      { pcId: req.params.id.toUpperCase() },
      update,
      { new: true }
    );
    if (!computer) return res.status(404).json({ success: false, message: 'Computer not found' });
    res.json({ success: true, data: computer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/computers/stats/summary
exports.getStats = async (req, res) => {
  try {
    const total = await Computer.countDocuments();
    const free = await Computer.countDocuments({ status: 'free' });
    const inUse = await Computer.countDocuments({ status: 'in-use' });
    const maintenance = await Computer.countDocuments({ status: 'maintenance' });
    const offline = await Computer.countDocuments({ status: 'offline' });
    res.json({ success: true, data: { total, free, inUse, maintenance, offline } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
