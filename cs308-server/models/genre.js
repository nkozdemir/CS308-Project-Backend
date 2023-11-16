const { DataTypes } = require('sequelize');
const connection = require('../config/db');

const Genre = connection.define('Genre', {
  GenreID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING,
  },
});

module.exports = Genre;
