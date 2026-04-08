const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');
const User = require('./User');

const FoodListing = sequelize.define('FoodListing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  donorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('available', 'requested', 'completed'),
    defaultValue: 'available',
  },
}, {
  timestamps: true,
});

FoodListing.belongsTo(User, { foreignKey: 'donorId', as: 'donor' });
User.hasMany(FoodListing, { foreignKey: 'donorId' });

module.exports = FoodListing;
