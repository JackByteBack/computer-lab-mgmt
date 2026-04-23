const Maintenance = require('../models/Maintenance');
const Computer = require('../models/Computer');

// GET /api/maintenance
exports.getAllTickets = async (req, res) => {
  try {
    const { status, priority, pcId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (pcId) filter.pcId = pcId.toUpperCase();

    const tickets = await Maintenance.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/maintenance/:id
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Maintenance.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/maintenance
exports.createTicket = async (req, res) => {
  try {
    const ticket = await Maintenance.create(req.body);
    // Auto-set computer to maintenance status
    if (['high', 'critical'].includes(ticket.priority)) {
      await Computer.findOneAndUpdate({ pcId: ticket.pcId }, { status: 'maintenance' });
    }
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/maintenance/:id
exports.updateTicket = async (req, res) => {
  try {
    if (req.body.status === 'resolved') {
      req.body.resolvedAt = new Date();
    }
    const ticket = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    // If resolved, set computer back to free
    if (req.body.status === 'resolved') {
      await Computer.findOneAndUpdate({ pcId: ticket.pcId }, { status: 'free' });
    }

    res.json({ success: true, data: ticket });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/maintenance/:id
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Maintenance.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/maintenance/stats/summary
exports.getStats = async (req, res) => {
  try {
    const open = await Maintenance.countDocuments({ status: 'open' });
    const inProgress = await Maintenance.countDocuments({ status: 'in-progress' });
    const resolved = await Maintenance.countDocuments({ status: 'resolved' });
    const high = await Maintenance.countDocuments({ priority: 'high', status: { $ne: 'resolved' } });
    res.json({ success: true, data: { open, inProgress, resolved, highPriority: high } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
