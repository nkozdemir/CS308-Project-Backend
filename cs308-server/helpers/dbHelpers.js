const GenreController = require('../controllers/genreController.js');
const PerformerController = require('../controllers/performerController.js');
const SongController = require('../controllers/songController.js');
const SongGenreController = require('../controllers/songGenreController.js');
const SongPerformerController = require('../controllers/songPerformerController.js');
const UserSongController = require('../controllers/userSongController.js');

async function addSongsToDatabase(songData, userID) {
    try {
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

module.exports = {
    addSongsToDatabase,
    // Add other helper functions here
};