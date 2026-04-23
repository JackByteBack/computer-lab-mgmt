const express = require('express');
const router = express.Router();
const {
  getAllTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  getStats
} = require('../controllers/maintenanceController');

router.get('/stats/summary', getStats);
router.get('/', getAllTickets);
router.get('/:id', getTicket);
router.post('/', createTicket);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

module.exports = router;
