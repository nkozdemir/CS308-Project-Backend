const { DataTypes } = require('sequelize');
const connection = require('../config/db');
const songModel = require('./song');

const UserSong = connection.define('UserSong', {
  UserSongID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  SongID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  TimesListened: {
    type: DataTypes.INTEGER,
  },
  DateAdded: {
    type: DataTypes.DATE,
  },
}, {
  freezeTableName: true,
});

UserSong.belongsTo(songModel, { foreignKey: 'SongID', as: 'SongInfo' });

module.exports = UserSong;