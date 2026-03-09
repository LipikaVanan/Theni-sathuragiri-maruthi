const asyncHandler = require('express-async-handler');
const Reward = require('../models/Reward');
const RewardOption = require('../models/RewardOption');

exports.getRewardOptions = asyncHandler(async (req, res) => {
  const options = await RewardOption.find().sort({ points: 1 });
  res.json(options);
});

exports.getRewards = asyncHandler(async (req, res) => {
  let reward = await Reward.findOne({ userId: req.params.userId });
  
  if (!reward) {
    reward = await Reward.create({
      userId: req.params.userId,
      points: 0,
      totalBookings: 0,
      redeemedRewards: []
    });
  }
  
  res.json(reward);
});

const RewardRule = require('../models/RewardRule');

exports.addPoints = asyncHandler(async (req, res) => {
  const { userId, amountSpent } = req.body;
  
  // Calculate points dynamically
  let earnedPoints = 0;
  if (amountSpent && amountSpent > 0) {
    const rule = await RewardRule.findOne() || { amountSpent: 100, pointsEarned: 10 };
    earnedPoints = Math.floor(amountSpent / (rule.amountSpent || 100)) * (rule.pointsEarned || 10);
  }

  // Support manual point passes if needed
  if (req.body.points) {
    earnedPoints = req.body.points;
  }
  
  let reward = await Reward.findOne({ userId });
  if (!reward) {
    reward = await Reward.create({
      userId,
      points: earnedPoints,
      totalBookings: 1,
      redeemedRewards: []
    });
  } else {
    reward.points += earnedPoints;
    reward.totalBookings += 1;
    await reward.save();
  }
  
  res.json(reward);
});

exports.redeemReward = asyncHandler(async (req, res) => {
  const { userId, points, rewardName } = req.body;
  
  const reward = await Reward.findOne({ userId });
  if (!reward) {
    res.status(404);
    throw new Error('Reward account not found');
  }
  
  if (reward.points < points) {
    res.status(400);
    throw new Error('Insufficient points');
  }
  
  reward.points -= points;
  reward.redeemedRewards.push({
    rewardName,
    pointsCost: points
  });
  
  await reward.save();
  
  res.json(reward);
});
