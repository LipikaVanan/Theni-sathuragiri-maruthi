const router = require('express').Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getVehicles, getMyVehicles, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');

router.route('/').get(protect, admin, getVehicles).post(protect, createVehicle);
router.get('/my', protect, getMyVehicles);
router.route('/:id').put(protect, updateVehicle).delete(protect, deleteVehicle);

module.exports = router;
