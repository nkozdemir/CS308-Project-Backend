const { DataTypes } = require('sequelize');
const connection = require('../config/db');

const songGenre = connection.define('SongGenre', {
  SongGenreID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SongID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  GenreID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

module.exports = songGenre;