const { DataTypes } = require('sequelize');
const connection = require('../config/db');
const SongRating = require('../models/songRating');
const SongPerformer = require('../models/songPerformer');

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

Song.hasMany(SongRating, { foreignKey: 'SongID', as: 'SongRatingInfo' });
SongRating.belongsTo(Song, { foreignKey: 'SongID', as: 'SongInfo' });

// Added this to get the songperformer link
SongPerformer.belongsTo(Song, { foreignKey: 'SongID', as: 'SongInfo' });

module.exports = Song;