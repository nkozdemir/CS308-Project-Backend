const { DataTypes } = require('sequelize');
const externalDB  = require('../config/externalDb');

const externalSong = externalDB.define('song', {
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
  Performers: {
    type: DataTypes.JSON, // Array of performers
    allowNull: false,
  },
  Genres: {
    type: DataTypes.JSON, // Array of genres
  },
}, {
  freezeTableName: true,
});

module.exports = externalSong;
