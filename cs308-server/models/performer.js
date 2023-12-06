const { DataTypes } = require('sequelize');
const connection = require('../config/db');

const Performer = connection.define('Performer', {
  PerformerID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  SpotifyID: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  freezeTableName: true,
});

module.exports = Performer;