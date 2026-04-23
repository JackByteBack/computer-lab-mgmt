const express = require('express');
const router = express.Router();
const {
  getAllLicenses,
  getLicense,
  createLicense,
  updateLicense,
  deleteLicense,
  getExpiring
} = require('../controllers/softwareController');

router.get('/expiring', getExpiring);
router.get('/', getAllLicenses);
router.get('/:id', getLicense);
router.post('/', createLicense);
router.put('/:id', updateLicense);
router.delete('/:id', deleteLicense);

module.exports = router;
