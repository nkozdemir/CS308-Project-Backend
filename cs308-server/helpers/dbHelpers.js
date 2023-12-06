const GenreController = require('../controllers/genreController.js');
const PerformerController = require('../controllers/performerController.js');
const SongController = require('../controllers/songController.js');
const SongGenreController = require('../controllers/songGenreController.js');
const SongPerformerController = require('../controllers/songPerformerController.js');
const UserSongController = require('../controllers/userSongController.js');
const UserController = require('../controllers/userController.js');
const ExternalSongController = require('../controllers/externalSongController.js')
const externalDB  = require('../config/externalDb');

async function addSongsToUser(songData, userID) {
  try {
    // check if userID is valid
    const user = await UserController.getUserById(userID);
    if (!user) throw new Error(`User with ID ${userID} does not exist`);

    // Loop through each song in the provided data
    for (const track of songData) {
      // Add genres to the Genre table if they don't exist
      const genreIds = [];
      for (const genre of track.Genres) {
        let existingGenre = await GenreController.getGenreByName(genre);
        if (!existingGenre) {
          // Genre does not exist, add it to the table
          existingGenre = await GenreController.createGenre(genre);
        }
        genreIds.push(existingGenre.GenreID);
      }

      // Add artist to the Performer table if it doesn't exist
      const performerIds = [];
      for (const artist of track.Performer) {
        let existingPerformer = await PerformerController.getPerformerBySpotifyID(artist.id);
        //console.log('Performer: ', existingPerformer);
        if (!existingPerformer) {
          // Performer does not exist, add it to the table
          existingPerformer = await PerformerController.createPerformer(artist.name, artist.id);
        }
        performerIds.push(existingPerformer.PerformerID);
      }

      // Add the song to the Song table
      let existingSong = await SongController.getSongBySpotifyID(track.Id);
      if (!existingSong) {
        // Song does not exist, add it to the table
        const songData = {
          title: track.Title,
          releaseDate: track.Album.release_date,
          album: track.Album.name,
          length: track.Length,
          spotifyID: track.Id,
        };
        existingSong = await SongController.createSong(songData);
      }
      
      //console.log('Existing song: ', existingSong);
      // Link user with the song in the UserSong table
      await UserSongController.linkUserSong(userID, existingSong.SongID);

      // Link performer with the song in the SongPerformer table
      for (const performerId of performerIds) {
        await SongPerformerController.linkSongPerformer(existingSong.SongID, performerId);
      }

      // Link genre with the song in the SongGenre table
      for (const genreId of genreIds) {
        await SongGenreController.linkSongGenre(existingSong.SongID, genreId);
      }
    }

    console.log('Songs added to the database successfully');
  } catch (error) {
    console.error('Error adding songs to the database:', error);
  }
}

async function deleteSong(songID) {
  try {
    const songPerformerLinks = await SongPerformerController.getLinkBySong(songID);
    const performerIDs = songPerformerLinks.map(link => link.PerformerID);
    // Check if performers have other songs linked to them
    for (const performerID of performerIDs) {
      const performerLinks = await SongPerformerController.getLinkByPerformer(performerID);
      // Delete song performer link
      await SongPerformerController.deleteSongPerformerByPerformerId(performerID);
      if (performerLinks.length == 1) {
        // Delete performer from Performer table
        await PerformerController.deletePerformerByPerformerId(performerID);
      } 
    }

    const songGenreLinks = await SongGenreController.getLinkBySong(songID);
    const genreIDs = songGenreLinks.map(link => link.GenreID);
    // Check if genres have other songs linked to them
    for (const genreID of genreIDs) {
      const genreLinks = await SongGenreController.getLinkByGenre(genreID);
      // Delete song genre link
      await SongGenreController.deleteSongGenreByGenreId(genreID);
      if (genreLinks.length == 1) {
        // Delete genre from Genre table
        await GenreController.deleteGenre(genreID);
      } 
    }
    
    // Delete song from UserSong table
    await UserSongController.deleteUserSongBySongId(songID);

    // Delete song from Song table
    await SongController.deleteSong(songID);

    console.log('Song removed from the database successfully');
  } catch (error) {
    console.error('Error removing song from the database:', error);
  }
}

async function removeSongFromUser(songID, userID) {
  try {
    // check if songId and userId are valid
    const song = await SongController.getSongByID(songID);
    if (!song) throw new Error(`Song with ID ${songID} does not exist`);

    // check if link with songId and userId exists
    const existingLink = await UserSongController.getUserSongLink(userID, songID);
    if (!existingLink) throw new Error(`User ${userID} is not linked to the song with ID ${songID}`);

    // check if song is linked to other users
    const songLinks = await UserSongController.getLinkBySong(songID);
    await UserSongController.deleteUserSong(userID, songID);
    if (songLinks.length > 1) return song;

    // Delete song from Song table
    await deleteSong(songID);
    console.log('Song unlinked from user successfully');

    return song;
  } catch (error) {
    console.error('Error removing song from the database:', error);
  }
}

async function deleteSongsByAlbum(albumName, userId) {
  try {
    // Get all songs with the specified album name
    const songsToDelete = await SongController.getSongsByAlbum(albumName);

    // Check if any songs were found
    if (songsToDelete.length === 0) {
      console.log(`No songs found for album ${albumName}`);
      return;
    }

    // Loop through each song and call removeSongFromUser
    for (const song of songsToDelete) {
      const songID = song.SongID;
      await removeSongFromUser(songID, userID);
    }

    console.log(`All songs from album ${albumName} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting songs from album ${albumName}:`, error);
  }
}

const transferDataFromExternalDB = async (userId) => {
  try {
    // Connect to the external database
    await externalDB.authenticate();
    console.log('Connected to the external database.');

    // Retrieve data from the external database
    const externalSongs = await ExternalSongController.getAllSongs();

    // Transfer data to the internal database
    for (const externalSong of externalSongs) {
      // Check if the song already exists in the internal database
      const existingSong = await SongController.getSongByTitleAndAlbum(externalSong.Title, externalSong.Album);

      if (!existingSong) {
        // Create a new song
        const newSong = {
          title: externalSong.Title,
          releaseDate: externalSong.ReleaseDate,
          album: externalSong.Album,
          length: externalSong.Length,
          spotifyID: externalSong.SpotifyID,
          image: externalSong.Image, // Adjust the format if needed
        };
        // Save the new song to the internal database and link to the user
        const createdSong = await SongController.createSong(newSong);
        await UserSongController.linkUserSong(userId, createdSong.SongID);

        // Link performers
        for (const externalPerformer of externalSong.Performers) {
          // Check if the performer already exists in the internal database based on SpotifyID
          let internalPerformer;
          if(externalPerformer.spotifyID != null) {
            internalPerformer = await PerformerController.getPerformerBySpotifyID(externalPerformer.spotifyId);
          }

          // If not found, check based on Name
          if (!internalPerformer) {
            internalPerformer = await PerformerController.getPerformerByName(externalPerformer.name);

            // If still not found, create a new performer
            if (!internalPerformer) {
              internalPerformer = await PerformerController.createPerformer(externalPerformer.name, externalPerformer.spotifyId);
            }
          }

          // Link song and performer
          await SongPerformerController.linkSongPerformer(createdSong.SongID, internalPerformer.PerformerID);
        }

        // Link genres
        for (const externalGenre of externalSong.Genres) {
          // Check if the genre already exists in the internal database
          let internalGenre = await GenreController.getGenreByName(externalGenre);

          if (!internalGenre) {
            // Create a new genre
            internalGenre = await GenreController.createGenre(externalGenre);
          }

          // Link song and genre
          await SongGenreController.linkSongGenre(createdSong.SongID, internalGenre.GenreID);
        }

        console.log(`Song "${createdSong.Title}" added to the internal database.`);
      } 
      else {
        // If the song already exists, link the user to the existing song
        await UserSongController.linkUserSong(userId, existingSong.SongID);
        console.log('Song linked to the user successfully');
      }
    }

    console.log('Data transfer completed.');
  } catch (error) {
    console.error('Error transferring data:', error);
  } 
};

module.exports = {
  addSongsToUser,
  deleteSong,
  removeSongFromUser,
  deleteSongsByAlbum,
  transferDataFromExternalDB,
  // Add other helper functions here
};