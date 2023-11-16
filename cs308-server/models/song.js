const { DataTypes } = require('sequelize');
const connection = require('../config/db'); // Assuming you have a MySQL connection setup

const Song = connection.define('Song', {
  songid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  performer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  album: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  length: {
    type: DataTypes.INTEGER,
  },
  // Add other fields for extra features
});

module.exports = Song;
