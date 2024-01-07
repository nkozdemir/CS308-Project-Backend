const { DataTypes } = require('sequelize');
const connection = require('../config/db');

const PlaylistSong = connection.define('PlaylistSong', {
    PlaylistSongID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    PlaylistID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    SongID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    }, {
    freezeTableName: true,
});

module.exports = PlaylistSong;