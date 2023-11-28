const songModel = require('../models/song');
const PerformerModel = require('../models/performer');

async function createSong(songData) {
  try {
    const song = await songModel.create({
      Title: songData.title, // string
      ReleaseDate: songData.releaseDate, // string
      Album: songData.album, // string
      Length: songData.length, // integer
      SpotifyID: songData.spotifyID, // string
      Image: songData.image, //json
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

const getSongByID = async (songId) => {
  try {
    const song = await songModel.findOne({
      where: {
        SongID: songId,
      },
      include: [
        {
          model: PerformerModel,
          attributes: ['Name'],
          through: { attributes: [] },
        },
      ],
    });

    return song;
  } catch (error) {
    console.error('Error getting song by ID:', error);
    throw error;
  }
};


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

async function deleteSong(songId) {
  try {
    const deletedSong = await songModel.destroy({
      where: {
        SongID: songId,
      },
    });
    return deletedSong;
  } catch (error) {
    console.error('Error deleting song by ID:', error);
    throw error;
  }
}

module.exports = {
  createSong,
  getSongByTitle,
  getSongByID,
  getSongBySpotifyID,
  deleteSong,
  // Add other Song-related controller functions here
};