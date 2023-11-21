const songModel = require('../models/song');

async function createSong(songData) {
  try {
    const song = await songModel.create({
      Title: songData.title, // string
      ReleaseDate: songData.releaseDate, // string
      Album: songData.album, // string
      Length: songData.length, // integer
      SpotifyID: songData.spotifyID, // string
    });
    return song;
  } catch (error) {
    console.error('Error creating song:', error);
    throw error;
  }
}

async function getSongByTitle(title) {
  try {
    const song = await songModel.findOne({
      where: {
        Title: title,
      },
    });
    return song;
  } catch (error) {
    console.error('Error getting song by title:', error);
    throw error;
  }
}

async function getSongBySpotifyID(spotifyID) {
  try {
    const song = await songModel.findOne({
      where: {
        SpotifyID: spotifyID,
      },
    });
    return song;
  } catch (error) {
    console.error('Error getting song by spotifyID:', error);
    throw error;
  }
}

module.exports = {
  createSong,
  getSongByTitle,
  getSongBySpotifyID,
  // Add other Song-related controller functions here
};