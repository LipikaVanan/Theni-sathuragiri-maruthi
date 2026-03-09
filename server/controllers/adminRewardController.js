const asyncHandler = require('express-async-handler');
const Reward = require('../models/Reward');
const RewardOption = require('../models/RewardOption');
const RewardRule = require('../models/RewardRule');
const User = require('../models/User');

// --- Reward Users ---
exports.getRewardsUsers = asyncHandler(async (req, res) => {
    const rewards = await Reward.find().populate('userId', 'name email');
    res.json(rewards);
});

exports.updateUserPoints = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { points } = req.body;
    let reward = await Reward.findOne({ userId: id });
    if (!reward) {
        reward = await Reward.create({ userId: id, points, totalBookings: 0 });
    } else {
        reward.points = points;
        await reward.save();
    }
    res.json(reward);
});

// --- Reward Options ---
exports.getRewardOptions = asyncHandler(async (req, res) => {
    const options = await RewardOption.find().sort({ points: 1 });
    res.json(options);
});

exports.createRewardOption = asyncHandler(async (req, res) => {
    const { title, points, desc, icon } = req.body;
    const option = await RewardOption.create({ title, points, desc, icon });
    res.status(201).json(option);
});

exports.updateRewardOption = asyncHandler(async (req, res) => {
    const option = await RewardOption.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!option) { res.status(404); throw new Error('Option not found'); }
    res.json(option);
});

exports.deleteRewardOption = asyncHandler(async (req, res) => {
    const option = await RewardOption.findByIdAndDelete(req.params.id);
    if (!option) { res.status(404); throw new Error('Option not found'); }
    res.json({ message: 'Option deleted' });
});

// --- Reward Rules ---
exports.getRewardRules = asyncHandler(async (req, res) => {
    let rule = await RewardRule.findOne();
    if (!rule) { rule = await RewardRule.create({}); }
    res.json(rule);
});

exports.updateRewardRules = asyncHandler(async (req, res) => {
    let rule = await RewardRule.findOne();
    if (!rule) {
        rule = await RewardRule.create(req.body);
    } else {
        Object.assign(rule, req.body);
        await rule.save();
    }
    res.json(rule);
});
