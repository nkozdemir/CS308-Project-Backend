const { DataTypes } = require('sequelize');
const connection = require('../config/db');
const Song = require('./song');
const Genre = require('./genre');

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

// Define associations
songGenre.belongsTo(Song, { foreignKey: 'SongID', as: 'SongInfo' });
songGenre.belongsTo(Genre, { foreignKey: 'GenreID', as: 'GenreInfo' });

module.exports = songGenre;