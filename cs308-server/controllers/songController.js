const songModel = require('../models/song');
const PerformerModel = require('../models/performer');
const GenreModel = require('../models/genre');
const userSongController = require('../controllers/userSongController'); 
const { Op } = require('sequelize');

async function createSong(songData) {
  try {
    const song = await songModel.create({
      Title: songData.title, // string
      ReleaseDate: songData.releaseDate, // string
      Album: songData.album, // string
      Length: songData.length, // integer
      SpotifyID: songData.spotifyID, // string
      Image: JSON.stringify(songData.image), //json
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
      include: [
        {
          model: PerformerModel,
          attributes: ['Name'],
          through: { attributes: [] },
        },
        {
          model: GenreModel,
          attributes: ['Name'],
          through: { attributes: [] },
        },
      ],
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
        {
          model: GenreModel,
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
      include: [
        {
          model: PerformerModel,
          attributes: ['Name'],
          through: { attributes: [] },
        },
        {
          model: GenreModel,
          attributes: ['Name'],
          through: { attributes: [] },
        },
      ],
    });
    return song;
  } catch (error) {
    console.error('Error getting song by spotifyID:', error);
    throw error;
  }
}

async function getSongByAlbum(albumName) {
  try {
    const songs = await songModel.findAll({
      where: {
        Album: albumName,
      },
      include: [
        {
          model: PerformerModel,
          attributes: ['Name'],
          through: { attributes: [] },
        },
        {
          model: GenreModel,
          attributes: ['Name'],
          through: { attributes: [] },
        },
      ],
    });
    return songs;
  } catch (error) {
    console.error('Error getting songs by album:', error);
    throw error;
  }
}

async function getSongByTitleAndAlbum(title, album) {
  try {
    const song = await songModel.findOne({
      where: {
        Title: title,
        Album: album,
      },
      include: [
        {
          model: PerformerModel,
          attributes: ['Name'],
          through: { attributes: [] },
        },
        {
          model: GenreModel,
          attributes: ['Name'],
          through: { attributes: [] },
        },
      ],
    });
    return song;
  } catch (error) {
    console.error('Error getting song by title and album:', error);
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

async function getSongsByUserIds(userIds) {
  try {
    // Get all user-song links for the provided user IDs
    const userSongLinks = await userSongController.getLinkByUsers(userIds);

    // Extract song IDs from user-song links
    const songIds = userSongLinks.map(link => link.SongID);

    // Get songs by the extracted song IDs
    const songs = await songModel.findAll({
      where: {
        SongID: songIds,
      },
      include: [
        {
          model: PerformerModel,
          attributes: ['Name'],
          through: { attributes: [] },
        },
        {
          model: GenreModel,
          attributes: ['Name'],
          through: { attributes: [] },
        },
      ],
    });

    return songs;
  } catch (error) {
    console.error('Error getting songs by user IDs:', error);
    throw error;
  }
}

async function getUserSongsByDecade(userId, decade) {
  try {
    // Calculate the start and end years for the given decade
    const startYear = decade;
    const endYear = decade + 9;

    // Get user-song links for the specified user
    const userSongLinks = await userSongController.getLinkByUser(userId);
    // Extract song IDs from the user-song links
    const songIds = userSongLinks.map(userSongLink => userSongLink.SongID);

    // Find all songs released within the specified decade and linked to the user
    const songsInDecade = await songModel.findAll({
      where: {
        SongID: songIds,
        ReleaseDate: {
          [Op.between]: [startYear, endYear],
        },
      },
      include: [
        {
          model: PerformerModel,
          attributes: ['Name'],
          through: { attributes: [] },
        },
        {
          model: GenreModel,
          attributes: ['Name'],
          through: { attributes: [] },
        },
      ],
    });

    return songsInDecade;
  } catch (error) {
    console.error('Error getting user songs by decade:', error);
    throw error;
  }
}

module.exports = {
  createSong,
  getSongByTitle,
  getSongByID,
  getSongBySpotifyID,
  getSongByAlbum,
  getSongByTitleAndAlbum,
  deleteSong,
  getSongsByUserIds,
  getUserSongsByDecade,
  // Add other Song-related controller functions here
};