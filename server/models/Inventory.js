const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    partName: { type: String, required: true },
    category: { type: String, required: true },
    stockQty: { type: Number, default: 0 },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', inventorySchema);
