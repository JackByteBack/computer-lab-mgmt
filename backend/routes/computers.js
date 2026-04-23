const express = require('express');
const router = express.Router();
const {
  getAllComputers,
  getComputer,
  createComputer,
  updateComputer,
  deleteComputer,
  updateStatus,
  getStats
} = require('../controllers/computerController');

router.get('/stats/summary', getStats);
router.get('/', getAllComputers);
router.get('/:id', getComputer);
router.post('/', createComputer);
router.put('/:id', updateComputer);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteComputer);

module.exports = router;
