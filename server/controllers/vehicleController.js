const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/Vehicle');

exports.getVehicles = asyncHandler(async (req, res) => {
    const vehicles = await Vehicle.find({}).populate('customer', 'name email phone');
    res.json(vehicles);
});

exports.getMyVehicles = asyncHandler(async (req, res) => {
    const vehicles = await Vehicle.find({ customer: req.user.id });
    res.json(vehicles);
});

exports.createVehicle = asyncHandler(async (req, res) => {
    const payload = { ...req.body, customer: req.user.id };
    if (!payload.brand || !payload.model || !payload.registrationNo) {
        res.status(400);
        throw new Error('Brand, model and registration number are required');
    }
    const vehicle = await Vehicle.create(payload);
    res.status(201).json(vehicle);
});

exports.updateVehicle = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) { res.status(404); throw new Error('Vehicle not found'); }
    Object.assign(vehicle, req.body);
    await vehicle.save();
    res.json(vehicle);
});

exports.deleteVehicle = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) { res.status(404); throw new Error('Vehicle not found'); }
    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed' });
});
