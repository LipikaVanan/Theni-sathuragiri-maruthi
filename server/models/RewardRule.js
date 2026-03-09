const mongoose = require('mongoose');

const rewardRuleSchema = new mongoose.Schema({
  amountSpent: { type: Number, default: 100 },
  pointsEarned: { type: Number, default: 10 },
  newUserBonus: { type: Number, default: 50 },
  reviewBonus: { type: Number, default: 20 }
}, { timestamps: true });

module.exports = mongoose.model('RewardRule', rewardRuleSchema);
