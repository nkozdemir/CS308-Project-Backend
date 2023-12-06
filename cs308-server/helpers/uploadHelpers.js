const songController = require('../controllers/songController');
const userSongController = require('../controllers/userSongController'); 
const performerController = require('../controllers/performerController'); 
const songPerformerController = require('../controllers/songPerformerController'); 
const genreController = require('../controllers/genreController'); 
const songGenreController = require('../controllers/songGenreController'); 
const { searchSong } = require('../helpers/spotifyHelpers');

async function addSongFromFile(userId, parsedData) {
  // Add each song inside parsedData to the database
  for (const song of parsedData) {
    // Check if song already exists in database, if exists link user to song and skip
    const existingSong = await songController.getSongByTitleAndAlbum(song.title, song.album);
    if (existingSong) {
      // Add song to UserSongs table
      await userSongController.linkUserSong(userId, existingSong.SongID);
    } else {
      // Search for song on Spotify
      const spotifySearchResults = await searchSong(song.title, song.performers, song.album);
      console.log('Spotify Search Results:', spotifySearchResults);
      // Check if song exists on Spotify
      if (spotifySearchResults.data.length > 0) {
        // Add most relevant song to database
        const mostRelevantSong = spotifySearchResults.data[0];
        console.log('Most Relevant Song:', mostRelevantSong);
        // Add song to Songs table
        const songId = await songController.createSong({
          Title: mostRelevantSong.name,
          Album: mostRelevantSong.album.name,
          Length: mostRelevantSong.duration_ms,
          ReleaseDate: mostRelevantSong.album.release_date,
          SpotifyID: mostRelevantSong.id,
          Image: mostRelevantSong.album.images,
        });
        // Add song to UserSongs table
        await userSongController.linkUserSong(userId, songId.SongID);
        // Add performers of the song to Performers table, one by one
        for (const performer of mostRelevantSong.Performer) {
          console.log('Performer (spotify):', performer);
          const performerIds = await performerController.createPerformer(performer.name, performer.id);
          // Add song to SongPerformers table
          await songPerformerController.linkSongPerformer(songId.SongID, performerIds.PerformerID);
        }
        // Add genres of the song to Genres table, one by one
        for (const genre of mostRelevantSong.Genre) {
          console.log('Genre (spotify):', genre);
          const genreIds = await genreController.createGenre(genre.name);
          // Add song to SongGenres table
          await songGenreController.linkSongGenre(songId.SongID, genreIds.GenreID);
        }

        console.log('Song added to database from Spotify successfully.');
      }
      else {
        // Add song to Songs table
        const songId = await songController.createSong(song);
        // Add song to UserSongs table
        await userSongController.linkUserSong(userId, songId.SongID);

        // Seperate performers and genres into arrays
        const performersArr = song.performers.split(',').map((performer) => performer.trim());
        const genresArr = song.genres.split(',').map((genre) => genre.trim());

        // Add performers of the song to Performers table, one by one
        for (const performer of performersArr) {
          //console.log('Performer:', performer);
          const performerIds = await performerController.createPerformer(performer, null);
          // Add song to SongPerformers table
          await songPerformerController.linkSongPerformer(songId.SongID, performerIds.PerformerID);
        }
        
        // Add genres of the song to Genres table, one by one
        for (const genre of genresArr) {
          //console.log('Genre:', genre);
          const genreIds = await genreController.createGenre(genre);
          // Add song to SongGenres table
          await songGenreController.linkSongGenre(songId.SongID, genreIds.GenreID);
        }
        
        console.log('Song added to database successfully.');
      }
    }
  }
}

module.exports = addSongFromFile;