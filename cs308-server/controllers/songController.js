const Song = require('../models/song');

async function createSong(title, releaseYear, album, length) {
  try {
    const song = await Song.create({
      Title: title,
      ReleaseYear: releaseYear,
      Album: album,
      Length: length,
    });
    return song;
  } catch (error) {
    console.error('Error creating song:', error);
    throw error;
  }
}

// Add other Song-related controller functions here

module.exports = {
  createSong,
  // Add other Song-related controller functions here
};