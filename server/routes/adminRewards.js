const express = require('express');
const router = express.Router();
const {
  getRewardsUsers,
  updateUserPoints,
  getRewardOptions,
  createRewardOption,
  updateRewardOption,
  deleteRewardOption,
  getRewardRules,
  updateRewardRules
} = require('../controllers/adminRewardController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/rewards-users', protect, admin, getRewardsUsers);
router.put('/users/:id/points', protect, admin, updateUserPoints);

router.post('/rewards', protect, admin, createRewardOption);
router.put('/rewards/:id', protect, admin, updateRewardOption);
router.delete('/rewards/:id', protect, admin, deleteRewardOption);

router.get('/rewards-rules', protect, admin, getRewardRules);
router.put('/rewards-rules', protect, admin, updateRewardRules);

module.exports = router;
