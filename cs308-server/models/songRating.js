
const { DataTypes } = require('sequelize');
const connection = require('../config/db');
const songModel = require('../models/song');

const songRating = connection.define('SongRating', {
  SongRatingID: {
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

module.exports = songRating;