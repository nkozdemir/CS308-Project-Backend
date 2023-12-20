const { DataTypes } = require('sequelize');
const connection = require('../config/db');
const PerformerModel = require('./performer');

const performerRating = connection.define('PerformerRating', {
  PerformerRatingID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  PerformerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

module.exports = performerRating;