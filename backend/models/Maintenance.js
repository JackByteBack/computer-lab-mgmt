const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true
  },
  pcId: {
    type: String,
    required: [true, 'PC ID is required']
  },
  issue: {
    type: String,
    required: [true, 'Issue description is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  assignee: {
    type: String,
    default: 'Unassigned'
  },
  reportedBy: {
    type: String,
    default: 'Admin'
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  resolution: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Auto-generate ticketId
maintenanceSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.ticketId = `TKT-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
