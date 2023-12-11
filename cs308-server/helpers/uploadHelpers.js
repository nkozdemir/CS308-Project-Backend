const songController = require('../controllers/songController');
const userSongController = require('../controllers/userSongController'); 
const performerController = require('../controllers/performerController'); 
const songPerformerController = require('../controllers/songPerformerController'); 
const genreController = require('../controllers/genreController'); 
const songGenreController = require('../controllers/songGenreController'); 
const { searchSong } = require('../helpers/spotifyHelpers');

async function addFromSpotify(userId, mostRelevantSong) {
  // Check if song already exists in database, if exists link user to song and skip
  const existingSong = await songController.getSongBySpotifyID(mostRelevantSong.SpotifyId);
  if (existingSong) {
    // Add song to UserSongs table
    await userSongController.linkUserSong(userId, existingSong.SongID);

    console.log('Song already exists in database, linked to user.');
    return;
  } else {
    // Add song to Songs table
    const songId = await songController.createSong({
      title: mostRelevantSong.Title,
      album: mostRelevantSong.Album.name,
      length: mostRelevantSong.Length,
      releaseDate: mostRelevantSong.Album.release_date,
      spotifyID: mostRelevantSong.SpotifyId,
      image: mostRelevantSong.Album.images,
    });

    // Add song to UserSongs table
    await userSongController.linkUserSong(userId, songId.SongID);

    // Add performers of the song to Performers table, one by one
    for (const performer of mostRelevantSong.Performer) {
      console.log('Performer (spotify):', performer);
      // Check if performer already exists in database, if exists link song to performer and skip
      const existingPerformer = await performerController.getPerformerBySpotifyID(performer.id);
      if (!existingPerformer) {
        const performerIds = await performerController.createPerformer(performer.name, performer.id);
        // Add song to SongPerformers table
        await songPerformerController.linkSongPerformer(songId.SongID, performerIds.PerformerID);
      } else {
        // Add song to SongPerformers table
        await songPerformerController.linkSongPerformer(songId.SongID, existingPerformer.PerformerID);
      }
    }

    // Add genres of the song to Genres table, one by one
    for (const genre of mostRelevantSong.Genres) {
      console.log('Genre (spotify):', genre);
      // Check if genre already exists in database, if exists link song to genre and skip
      const existingGenre = await genreController.getGenreByName(genre);
      if (!existingGenre) {
        const genreIds = await genreController.createGenre(genre);
        // Add song to SongGenres table
        await songGenreController.linkSongGenre(songId.SongID, genreIds.GenreID);
      } else {
        // Add song to SongGenres table
        await songGenreController.linkSongGenre(songId.SongID, existingGenre.GenreID);
      }
    }

    console.log('Song added to database from Spotify successfully.');
    return;
  }
}

async function addSongFromFile(userId, parsedData) {
  // Add each song inside parsedData to the database
  for (const song of parsedData) {
    // Check if song already exists in database, if exists link user to song and skip
    const existingSong = await songController.getSongByTitleAndAlbum(song.title, song.album);
    if (existingSong) {
      // Add song to UserSongs table
      await userSongController.linkUserSong(userId, existingSong.SongID);
    } else {
      // Check if song exists on Spotify
      const spotifySearchResults = await searchSong(song.title, song.performers, song.album);
      console.log('Spotify Search Results:', spotifySearchResults);
      if (spotifySearchResults.data !== null && spotifySearchResults.data.length > 0) {
        // Add most relevant result to database
        const mostRelevantSong = spotifySearchResults.data[0];
        console.log('Most Relevant Song:', mostRelevantSong);

        await addFromSpotify(userId, mostRelevantSong);
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
          console.log('Performer:', performer);
          const existingPerformer = await performerController.getPerformerByName(performer);
          if (existingPerformer) {
            await songPerformerController.linkSongPerformer(songId.SongID, existingPerformer.PerformerID);
          }
          else {
            const performerIds = await performerController.createPerformer(performer, null);
            // Add song to SongPerformers table
            await songPerformerController.linkSongPerformer(songId.SongID, performerIds.PerformerID);
          }
        }
        
        // Add genres of the song to Genres table, one by one
        for (const genre of genresArr) {
          console.log('Genre:', genre);
          // if genre already exists in database, do not create new genre
          const existingGenre = await genreController.getGenreByName(genre);
          if (existingGenre) {
            await songGenreController.linkSongGenre(songId.SongID, existingGenre.GenreID);
          }
          else {
            const genreIds = await genreController.createGenre(genre);
            await songGenreController.linkSongGenre(songId.SongID, genreIds.GenreID);
          }
        }
        
        console.log('Song added to database successfully.');
      }
    }
  }
}

module.exports = addSongFromFile;