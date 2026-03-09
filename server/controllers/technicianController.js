const asyncHandler = require('express-async-handler');
const Technician = require('../models/Technician');

exports.getTechnicians = asyncHandler(async (req, res) => {
    const technicians = await Technician.find({});
    res.json(technicians);
});

exports.createTechnician = asyncHandler(async (req, res) => {
    if (!req.body.name || !req.body.specialization) {
        res.status(400);
        throw new Error('Name and specialization are required');
    }
    const technician = await Technician.create(req.body);
    res.status(201).json(technician);
});

exports.updateTechnician = asyncHandler(async (req, res) => {
    const tech = await Technician.findById(req.params.id);
    if (!tech) { res.status(404); throw new Error('Technician not found'); }
    Object.assign(tech, req.body);
    await tech.save();
    res.json(tech);
});

exports.deleteTechnician = asyncHandler(async (req, res) => {
    const tech = await Technician.findById(req.params.id);
    if (!tech) { res.status(404); throw new Error('Technician not found'); }
    await tech.deleteOne();
    res.json({ message: 'Technician removed' });
});
