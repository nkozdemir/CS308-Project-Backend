const { DataTypes } = require('sequelize');
const connection = require('../config/db');

const rating = connection.define('Rating', {
  RatingID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  SongID: {
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

module.exports = rating;