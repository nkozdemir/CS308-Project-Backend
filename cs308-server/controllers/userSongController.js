const userSongModel = require('../models/usersong');

async function getUserSongLink(userID, songID) {
  try {
    const userSongLink = await userSongModel.findOne({
      where: {
        UserID: userID,
        SongID: songID,
      },
    });
    return userSongLink;
  } catch (error) {
    console.error('Error getting user-song link:', error);
    throw error;
  }
}

async function getLinkByUser(userID) {
  try {
    const userSongLink = await userSongModel.findAll({
      where: {
        UserID: userID,
      },
    });
    return userSongLink;
  } catch (error) {
    console.error('Error getting user-song link:', error);
    throw error;
  }
}

async function getLinkBySong(songID) {
  try {
    const userSongLink = await userSongModel.findAll({
      where: {
        SongID: songID,
      },
    });
    return userSongLink;
  } catch (error) {
    console.error('Error getting user-song link:', error);
    throw error;
  }
}

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

async function deleteUserSong(userID, songID) {
  try {
    const deletedUserSong = await userSongModel.destroy({
      where: {
        UserID: userID,
        SongID: songID,
      },
    });
    return deletedUserSong;
  } catch (error) {
    console.error('Error deleting user-song link:', error);
    throw error;
  }
}

module.exports = {
  getUserSongLink,
  getLinkByUser,
  getLinkBySong,
  linkUserSong,
  deleteUserSong,
  // Add other UserSong-related controller functions here
};