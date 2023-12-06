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
        // Add song to Songs table
        const songId = await songController.createSong(song);
        // Add song to UserSongs table
        await userSongController.linkUserSong(userId, songId.SongID);

        // Seperate performers and genres into arrays
        const performersArr = song.performers.split(',').map((performer) => performer.trim());
        const genresArr = song.genres.split(',').map((genre) => genre.trim());

        // Add performers of the song to Performers table, one by one
        for (const performer of performersArr) {
            console.log('Performer:', performer);
            const performerIds = await performerController.createPerformer(performer, null);
            // Add song to SongPerformers table
            await songPerformerController.linkSongPerformer(songId.SongID, performerIds.PerformerID);
        }
        
        // Add genres of the song to Genres table, one by one
        for (const genre of genresArr) {
            console.log('Genre:', genre);
            const genreIds = await genreController.createGenre(genre);
            // Add song to SongGenres table
            await songGenreController.linkSongGenre(songId.SongID, genreIds.GenreID);
        }
        
        console.log('Song added to database successfully.');
      }
    }
}

module.exports = addSongFromFile;