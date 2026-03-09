const express = require('express');
const router = express.Router();
const { getRewards, addPoints, redeemReward, getRewardOptions } = require('../controllers/rewardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/options', getRewardOptions);
router.get('/:userId', protect, getRewards);
router.post('/add', protect, addPoints);
router.post('/redeem', protect, redeemReward);

module.exports = router;
