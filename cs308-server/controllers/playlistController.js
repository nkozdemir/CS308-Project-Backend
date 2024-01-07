const playlistModel = require('../models/playlist');
const { Sequelize, Op } = require('sequelize');

async function createPlaylist(playlistName, userID) {
    try {
        const playlist = await playlistModel.create({
            Name: playlistName,
            UserID: userID,
            DateAdded: Sequelize.fn('NOW'),
            Image: null,
        });
        return playlist;
    } catch (error) {
        console.error('Error creating playlist:', error);
        throw error;
    }
}

async function getPlaylistById(playlistID) {
    try {
        const playlist = await playlistModel.findOne({
            where: {
                PlaylistID: playlistID,
            },
        });
        return playlist;
    } catch (error) {
        console.error('Error getting playlist by id:', error);
        throw error;
    }
}

async function getPlaylistByUser(userID) {
    try {
        const playlist = await playlistModel.findAll({
            where: {
                UserID: userID,
            },
        });
        return playlist;
    } catch (error) {
        console.error('Error getting playlist by user:', error);
        throw error;
    }
}

async function deletePlaylist(playlistID) {
    try {
        const playlist = await playlistModel.destroy({
            where: {
                PlaylistID: playlistID,
            },
        });
        return playlist;
    } catch (error) {
        console.error('Error deleting playlist:', error);
        throw error;
    }
}

module.exports = {
    createPlaylist,
    getPlaylistById,
    getPlaylistByUser,
    deletePlaylist,
}; 