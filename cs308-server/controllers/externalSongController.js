const externalSongModel = require('../models/externalSong');

async function getAllSongs() {
    try {
      const songs = await externalSongModel.findAll();
      return songs;
    } catch (error) {
      console.error('Error getting all songs:', error);
      throw error;
    }
  }

async function getSongByTitleAndAlbum(title, album) {
    try {
      const song = await externalSongModel.findOne({
        where: {
          Title: title,
          Album: album,
        },
      });
      return song;
    } catch (error) {
      console.error('Error getting song by title and album:', error);
      throw error;
    }
  }

module.exports = {
    getSongByTitleAndAlbum,
    getAllSongs,
}