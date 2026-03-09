const asyncHandler = require('express-async-handler');
const Inventory = require('../models/Inventory');

exports.getInventory = asyncHandler(async (req, res) => {
    const items = await Inventory.find({});
    res.json(items);
});

exports.createInventory = asyncHandler(async (req, res) => {
    if (!req.body.partName || !req.body.price) {
        res.status(400);
        throw new Error('Part name and price are required');
    }
    const item = await Inventory.create(req.body);
    res.status(201).json(item);
});

exports.updateInventory = asyncHandler(async (req, res) => {
    const item = await Inventory.findById(req.params.id);
    if (!item) { res.status(404); throw new Error('Item not found'); }
    Object.assign(item, req.body);
    await item.save();
    res.json(item);
});

exports.deleteInventory = asyncHandler(async (req, res) => {
    const item = await Inventory.findById(req.params.id);
    if (!item) { res.status(404); throw new Error('Item not found'); }
    await item.deleteOne();
    res.json({ message: 'Inventory item removed' });
});

exports.getLowStock = asyncHandler(async (req, res) => {
    const items = await Inventory.find({ stockQty: { $lte: 5 } });
    res.json(items);
});
