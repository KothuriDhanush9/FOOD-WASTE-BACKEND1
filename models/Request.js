const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');
const User = require('./User');
const FoodListing = require('./FoodListing');

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  foodId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: FoodListing,
      key: 'id',
    },
  },
  recipientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
});

Request.belongsTo(FoodListing, { foreignKey: 'foodId', as: 'foodListing' });
Request.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });
FoodListing.hasMany(Request, { foreignKey: 'foodId' });
User.hasMany(Request, { foreignKey: 'recipientId' });

module.exports = Request;
