const SoftwareLicense = require('../models/SoftwareLicense');

// GET /api/software
exports.getAllLicenses = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const licenses = await SoftwareLicense.find(filter).sort({ name: 1 });
    res.json({ success: true, count: licenses.length, data: licenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/software/:id
exports.getLicense = async (req, res) => {
  try {
    const license = await SoftwareLicense.findById(req.params.id);
    if (!license) return res.status(404).json({ success: false, message: 'License not found' });
    res.json({ success: true, data: license });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/software
exports.createLicense = async (req, res) => {
  try {
    const license = await SoftwareLicense.create(req.body);
    res.status(201).json({ success: true, data: license });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/software/:id
exports.updateLicense = async (req, res) => {
  try {
    const license = await SoftwareLicense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!license) return res.status(404).json({ success: false, message: 'License not found' });
    res.json({ success: true, data: license });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/software/:id
exports.deleteLicense = async (req, res) => {
  try {
    const license = await SoftwareLicense.findByIdAndDelete(req.params.id);
    if (!license) return res.status(404).json({ success: false, message: 'License not found' });
    res.json({ success: true, message: 'License deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/software/expiring
exports.getExpiring = async (req, res) => {
  try {
    const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const licenses = await SoftwareLicense.find({
      expiryDate: { $lte: thirtyDaysLater, $gt: new Date() }
    }).sort({ expiryDate: 1 });
    res.json({ success: true, count: licenses.length, data: licenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
