const mongoose = require('mongoose');

const rewardOptionSchema = new mongoose.Schema({
  points: { type: Number, required: true },
  title: { type: String, required: true },
  desc: { type: String },
  icon: { type: String, default: '🎁' }
}, { timestamps: true });

module.exports = mongoose.model('RewardOption', rewardOptionSchema);
