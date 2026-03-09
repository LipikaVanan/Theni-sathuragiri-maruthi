const router = require('express').Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getInventory, createInventory, updateInventory, deleteInventory, getLowStock } = require('../controllers/inventoryController');

router.route('/').get(protect, admin, getInventory).post(protect, admin, createInventory);
router.get('/low-stock', protect, admin, getLowStock);
router.route('/:id').put(protect, admin, updateInventory).delete(protect, admin, deleteInventory);

module.exports = router;
