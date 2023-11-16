const { DataTypes } = require('sequelize');
const connection = require('../config/db');

const Song = connection.define('Song', {
  SongID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ReleaseYear: {
    type: DataTypes.INTEGER,
  },
  Album: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Length: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Song;
