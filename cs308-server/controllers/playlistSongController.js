const playlistSongModel = require('../models/playlistSong');

async function createPlaylistSong(playlistID, songID) {
    try {
        const playlistSong = await playlistSongModel.create({
            PlaylistID: playlistID,
            SongID: songID,
        });
        return playlistSong;
    } catch (error) {
        console.error('Error creating playlist song:', error);
        throw error;
    }
}

async function getPlaylistSongByPlaylist(playlistID) {
    try {
        const playlistSong = await playlistSongModel.findAll({
            where: {
                PlaylistID: playlistID,
            },
        });
        return playlistSong;
    } catch (error) {
        console.error('Error getting playlist song by playlist:', error);
        throw error;
    }
}

async function deletePlaylistSong(playlistID, songID) {
    try {
        const playlistSong = await playlistSongModel.destroy({
            where: {
                PlaylistID: playlistID,
                SongID: songID,
            },
        });
        return playlistSong;
    } catch (error) {
        console.error('Error deleting playlist song:', error);
        throw error;
    }
}

async function deletePlaylistSongByPlaylist(playlistID) {
    try {
        const playlistSong = await playlistSongModel.destroy({
            where: {
                PlaylistID: playlistID,
            },
        });
        return playlistSong;
    } catch (error) {
        console.error('Error deleting playlist song:', error);
        throw error;
    }
}

module.exports = {
    createPlaylistSong,
    getPlaylistSongByPlaylist,
    deletePlaylistSong,
    deletePlaylistSongByPlaylist
};