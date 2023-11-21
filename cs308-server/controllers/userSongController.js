const userSongModel = require('../models/usersong.js');

async function linkUserSong(userID, songID) {
  try {
    const existingLink = await userSongModel.findOne({
      where: {
        UserID: userID,
        SongID: songID,
      },
    });
    if (existingLink) {
      console.log(`User ${userID} is already linked to the song with ID ${songID}`);
      return existingLink;
    }
    
    const userSong = await userSongModel.create({
      UserID: userID,
      SongID: songID,
    });
    return userSong;
  } catch (error) {
    console.error('Error linking user and song:', error);
    throw error;
  }
}

module.exports = {
    linkUserSong,
    // Add other UserSong-related controller functions here
};