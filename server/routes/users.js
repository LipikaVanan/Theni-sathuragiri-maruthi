const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getUsers, deleteUser, blockUser } = require('../controllers/userController');

router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/block', protect, admin, blockUser);

module.exports = router;
