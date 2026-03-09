const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { createBooking, getBookings, getMyBookings, updateBooking, deleteBooking } = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/', protect, admin, getBookings);
router.get('/my', protect, getMyBookings);
router.put('/:id', protect, admin, updateBooking);
router.delete('/:id', protect, admin, deleteBooking);

module.exports = router;
