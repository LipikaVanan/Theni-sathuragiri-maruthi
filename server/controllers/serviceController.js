const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');

exports.getServices = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  let filter = {};
  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }
  if (category) {
    filter.category = category;
  }
  const services = await Service.find(filter);
  res.json(services);
});

exports.createService = asyncHandler(async (req, res) => {
  const { title, description, price, image, category } = req.body;
  if (!title || !price) {
    res.status(400);
    throw new Error('Title and price are required');
  }
  const service = await Service.create({ title, description, price, image, category });
  res.status(201).json(service);
});

exports.updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  Object.assign(service, req.body);
  await service.save();
  res.json(service);
});

exports.deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  await service.deleteOne();
  res.json({ message: 'Service removed' });
});
