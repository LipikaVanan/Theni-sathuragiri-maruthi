const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
  duration: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Alias: serviceName → title (for compatibility)
serviceSchema.virtual('serviceName').get(function () { return this.title; });

module.exports = mongoose.model('Service', serviceSchema);
