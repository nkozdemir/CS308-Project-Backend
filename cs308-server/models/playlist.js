const { DataTypes } = require('sequelize');
const connection = require('../config/db');

const Playlist = connection.define('Playlist', {
    PlaylistID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    DateAdded: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    Image: {
        type: DataTypes.JSON,
    },
    }, {
    freezeTableName: true,
});

module.exports = Playlist;