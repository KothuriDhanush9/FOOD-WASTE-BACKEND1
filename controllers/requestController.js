const { Op } = require('sequelize');
const Request = require('../models/Request');
const FoodListing = require('../models/FoodListing');
const User = require('../models/User');

exports.createRequest = async (req, res, next) => {
  try {
    const { foodId } = req.body;
    const food = await FoodListing.findByPk(foodId);
    if (!food || food.status !== 'available') {
      return res.status(400).json({ message: 'Food item is no longer available' });
    }

    const existingRequest = await Request.findOne({ where: { foodId, recipientId: req.user.id } });
    if (existingRequest) {
      return res.status(400).json({ message: 'Request already submitted for this item' });
    }

    const request = await Request.create({ foodId, recipientId: req.user.id });
    await food.update({ status: 'requested' });

    const populated = await Request.findByPk(request.id, {
      include: [
        { model: FoodListing, as: 'foodListing' },
        { model: User, as: 'recipient', attributes: ['name', 'email'] },
      ],
    });
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.getRequests = async (req, res, next) => {
  try {
    const where = {};
    if (req.user.role === 'recipient') {
      where.recipientId = req.user.id;
    }
    if (req.user.role === 'donor') {
      const donorListings = await FoodListing.findAll({ where: { donorId: req.user.id }, attributes: ['id'] });
      const foodIds = donorListings.map(item => item.id);
      where.foodId = { [Op.in]: foodIds };
    }

    const requests = await Request.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        { model: FoodListing, as: 'foodListing' },
        { model: User, as: 'recipient', attributes: ['name', 'email'] },
      ],
    });

    res.json(requests);
  } catch (err) {
    next(err);
  }
};

exports.updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const request = await Request.findByPk(id, {
      include: [{ model: FoodListing, as: 'foodListing' }],
    });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.foodListing.donorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    await request.update({ status });

    if (status === 'accepted') {
      // Mark food as completed
      await request.foodListing.update({ status: 'completed' });
      // Reject all other pending requests for this food
      await Request.update(
        { status: 'rejected' },
        { where: { foodId: request.foodId, id: { [Op.ne]: request.id }, status: 'pending' } }
      );
    }
    
    if (status === 'rejected') {
      // Check if there are other pending requests
      const otherPendingRequests = await Request.count({
        where: { foodId: request.foodId, status: 'pending', id: { [Op.ne]: request.id } },
      });
      
      // If no other pending requests, set food back to available
      if (otherPendingRequests === 0) {
        const acceptedRequests = await Request.count({
          where: { foodId: request.foodId, status: 'accepted' },
        });
        if (acceptedRequests === 0) {
          await request.foodListing.update({ status: 'available' });
        }
      }
    }

    const updatedRequest = await Request.findByPk(request.id, {
      include: [
        { model: FoodListing, as: 'foodListing' },
        { model: User, as: 'recipient', attributes: ['name', 'email'] },
      ],
    });

    res.json(updatedRequest);
  } catch (err) {
    next(err);
  }
};
