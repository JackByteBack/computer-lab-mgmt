const mongoose = require('mongoose');

const computerSchema = new mongoose.Schema({
  pcId: {
    type: String,
    required: [true, 'PC ID is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  hostname: {
    type: String,
    required: [true, 'Hostname is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['free', 'in-use', 'maintenance', 'offline'],
    default: 'free'
  },
  currentUser: {
    type: String,
    default: null
  },
  specs: {
    cpu: { type: String, default: 'Intel Core i5' },
    ram: { type: String, default: '8GB' },
    storage: { type: String, default: '512GB SSD' },
    os: { type: String, default: 'Windows 11' }
  },
  location: {
    lab: { type: String, default: 'Lab A' },
    row: { type: Number },
    seat: { type: Number }
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Computer', computerSchema);
