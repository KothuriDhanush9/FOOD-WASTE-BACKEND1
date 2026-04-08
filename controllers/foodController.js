const { Op } = require('sequelize');
const FoodListing = require('../models/FoodListing');
const Request = require('../models/Request');
const User = require('../models/User');

exports.createListing = async (req, res, next) => {
  try {
    const listing = await FoodListing.create({
      ...req.body,
      donorId: req.user.id,
      status: 'available',
    });
    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

exports.getAllListings = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.search) {
      where.title = { [Op.like]: `%${req.query.search}%` };
    }
    if (req.query.location) {
      where.location = { [Op.like]: `%${req.query.location}%` };
    }
    if (req.query.status) {
      where.status = req.query.status;
    }

    const listings = await FoodListing.findAll({
      where,
      include: [{ model: User, as: 'donor', attributes: ['name', 'email'] }],
    });
    res.json(listings);
  } catch (err) {
    next(err);
  }
};

exports.getListingById = async (req, res, next) => {
  try {
    const listing = await FoodListing.findByPk(req.params.id, {
      include: [{ model: User, as: 'donor', attributes: ['name', 'email'] }],
    });
    if (!listing) {
      return res.status(404).json({ message: 'Food listing not found' });
    }
    res.json(listing);
  } catch (err) {
    next(err);
  }
};

exports.updateListing = async (req, res, next) => {
  try {
    const listing = await FoodListing.findByPk(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Food listing not found' });
    }
    if (listing.donorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    await listing.update(req.body);
    const updated = await FoodListing.findByPk(listing.id, {
      include: [{ model: User, as: 'donor', attributes: ['name', 'email'] }],
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await FoodListing.findByPk(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Food listing not found' });
    }
    if (listing.donorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await listing.destroy();
    await Request.destroy({ where: { foodId: listing.id } });
    res.json({ message: 'Food listing deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getDonorHistory = async (req, res, next) => {
  try {
    const listings = await FoodListing.findAll({ 
      where: { donorId: req.user.id },
      include: [{ model: User, as: 'donor', attributes: ['name', 'email'] }],
    });
    res.json(listings);
  } catch (err) {
    next(err);
  }
};
