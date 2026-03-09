const router = require('express').Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getTechnicians, createTechnician, updateTechnician, deleteTechnician } = require('../controllers/technicianController');

router.route('/').get(getTechnicians).post(protect, admin, createTechnician);
router.route('/:id').put(protect, admin, updateTechnician).delete(protect, admin, deleteTechnician);

module.exports = router;
