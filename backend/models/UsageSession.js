const mongoose = require('mongoose');

const usageSessionSchema = new mongoose.Schema({
  pcId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  logoutTime: {
    type: Date,
    default: null
  },
  durationMinutes: {
    type: Number,
    default: null
  },
  active: {
    type: Boolean,
    default: true
  },
  purpose: {
    type: String,
    default: 'General Use'
  }
}, { timestamps: true });

// Auto-calculate duration on logout
usageSessionSchema.pre('save', function (next) {
  if (this.logoutTime && this.loginTime) {
    this.durationMinutes = Math.round((this.logoutTime - this.loginTime) / 60000);
    this.active = false;
  }
  next();
});

module.exports = mongoose.model('UsageSession', usageSessionSchema);
