const mongoose = require('mongoose');

const softwareLicenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Software name is required'],
    trim: true
  },
  version: {
    type: String,
    default: 'Latest'
  },
  licenseType: {
    type: String,
    enum: ['Volume', 'Named', 'Concurrent', 'Site', 'Open Source', 'Academic'],
    required: true
  },
  licenseKey: {
    type: String,
    default: 'N/A'
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1
  },
  usedSeats: {
    type: Number,
    default: 0
  },
  vendor: {
    type: String,
    default: 'Unknown'
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    default: null
  },
  cost: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'warn', 'critical'],
    default: 'active'
  },
  installedOn: [{
    type: String  // PC IDs
  }],
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Auto-calculate status before save
softwareLicenseSchema.pre('save', function (next) {
  if (!this.expiryDate) return next();
  const daysLeft = Math.ceil((this.expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 0) this.status = 'expired';
  else if (daysLeft <= 14) this.status = 'critical';
  else if (daysLeft <= 30) this.status = 'warn';
  else this.status = 'active';
  next();
});

module.exports = mongoose.model('SoftwareLicense', softwareLicenseSchema);
