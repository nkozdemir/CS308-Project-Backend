const { DataTypes } = require('sequelize');
const connection = require('../config/db');

const songPerformer = connection.define('SongPerformer', {
  SongPerformerID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SongID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  PerformerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

module.exports = songPerformer;