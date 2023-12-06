const { DataTypes } = require('sequelize');
const connection = require('../config/db');
const SongModel = require('./song');

const Genre = connection.define('Genre', {
  GenreID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING,
    unique: true,
  },
}, {
  freezeTableName: true,
});

Genre.belongsToMany(SongModel, { through: 'SongGenre', foreignKey: 'GenreID' });
SongModel.belongsToMany(Genre, { through: 'SongGenre', foreignKey: 'SongID' });

module.exports = Genre;