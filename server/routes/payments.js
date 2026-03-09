const router = require('express').Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getPayments, createPayment, updatePayment, deletePayment } = require('../controllers/paymentController');

router.route('/').get(protect, admin, getPayments).post(protect, admin, createPayment);
router.route('/:id').put(protect, admin, updatePayment).delete(protect, admin, deletePayment);

module.exports = router;
