const { Op, fn, col, literal } = require('sequelize');
const FoodListing = require('../models/FoodListing');
const Request = require('../models/Request');

exports.getOverview = async (req, res, next) => {
  try {
    const totalDonations = await FoodListing.count();
    const totalRequests = await Request.count();
    const completedDonations = await Request.count({ where: { status: 'accepted' } });
    const availableItems = await FoodListing.count({ where: { status: 'available' } });

    res.json({ totalDonations, totalRequests, completedDonations, availableItems });
  } catch (err) {
    next(err);
  }
};

exports.getWasteTrends = async (req, res, next) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const listings = await FoodListing.findAll({
      where: { createdAt: { [Op.gte]: startDate } },
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('COUNT', '*'), 'count'],
      ],
      group: [fn('DATE', col('createdAt'))],
      order: [[fn('DATE', col('createdAt')), 'ASC']],
      raw: true,
    });

    const wasteByFood = await FoodListing.findAll({
      attributes: [
        'title',
        [fn('SUM', col('quantity')), 'wasted'],
      ],
      group: ['title'],
      order: [[fn('SUM', col('quantity')), 'DESC']],
      limit: 5,
      raw: true,
    });

    res.json({ listings, wasteByFood });
  } catch (err) {
    next(err);
  }
};

exports.getDemandSupply = async (req, res, next) => {
  try {
    const supply = await FoodListing.count();
    const demand = await Request.count({ where: { status: 'pending' } });
    res.json({ supply, demand, ratio: supply ? demand / supply : 0 });
  } catch (err) {
    next(err);
  }
};
