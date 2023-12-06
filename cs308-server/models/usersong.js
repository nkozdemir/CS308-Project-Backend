const { DataTypes } = require('sequelize');
const connection = require('../config/db');

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
}, {
  freezeTableName: true,
});

module.exports = UserSong;