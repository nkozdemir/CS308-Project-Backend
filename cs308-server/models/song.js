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
  ReleaseDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Album: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Length: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  SpotifyID: {
    type: DataTypes.STRING,
  }, 
  Image: {
    type: DataTypes.JSON,
  }, 
}, {
  freezeTableName: true,
});

module.exports = Song;