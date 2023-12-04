/*
Notes:
- Add song method only adds songs to the db using getTopTracksFromPlaylist() method (for development purposes)
- To be modified in the future
*/
const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const userSongController = require('../controllers/userSongController'); 
const performerController = require('../controllers/performerController'); 
const songPerformerController = require('../controllers/songPerformerController'); 
const genreController = require('../controllers/genreController'); 
const songGenreController = require('../controllers/songGenreController'); 
const { removeSongFromUser, addSongsToUser } = require('../helpers/dbHelpers');
const { getTopTracksFromPlaylist, getArtistGenres } = require('../helpers/spotifyHelpers');
const authenticateToken = require('../helpers/authToken');
const spotifyApi = require('../config/spotify.js');

// Route to add songs linked to specific user, to database
router.post('/addSpotifySong', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { spotifyId } = req.body;

    // Fetch song details from Spotify API using the provided Spotify ID
    const spotifyApiResponse = await spotifyApi.getTrack(spotifyId);

    if (!spotifyApiResponse.body) {
      return res.status(404).json({ error: 'Song not found on Spotify' });
    }

    const spotifyTrack = spotifyApiResponse.body;
    
    const artistInfo = spotifyTrack.artists.map(artist => ({
      id: artist.id,
    }));
    // Get album genres, if empty get artist genres
    const albumGenres = spotifyTrack.album.genres;
    const artistIds = artistInfo.map(artist => artist.id);
    const artistGenres = await getArtistGenres(artistIds);
    const genresToUse = albumGenres && albumGenres.length > 0 ? albumGenres : artistGenres;

    // Check if the song already exists in the database
    const existingSong = await songController.getSongBySpotifyID(spotifyTrack.id);

    // If the song doesn't exist, add it to the database
    if (!existingSong) {
      // Create a new song
      const newSong = {
        spotifyID: spotifyTrack.id,
        title: spotifyTrack.name,
        releaseDate: spotifyTrack.album.release_date,
        album: spotifyTrack.album.name,
        length: spotifyTrack.duration_ms,
        image: spotifyTrack.album.images, // Adjust the format if needed
        // Add other relevant song details
      };

      // Save the new song to the database
      const createdSong = await songController.createSong(newSong);

      // Link the user to the newly created song
      await userSongController.linkUserSong(userId, createdSong.SongID);

      // Check if the performers exist and create them if not
      for (const artist of spotifyTrack.artists) {
        let performer = await performerController.getPerformerBySpotifyID(artist.id);
        if (!performer) {
          performer = await performerController.createPerformer(artist.name, artist.id);
        }
        await songPerformerController.linkSongPerformer(createdSong.SongID, performer.PerformerID);
      }

      // Check if genres exist and create them if not
      for (const genreName of genresToUse) {
        let genre = await genreController.getGenreByName(genreName);
        if (!genre) {
          genre = await genreController.createGenre(genreName);
        }
        await songGenreController.linkSongGenre(createdSong.SongID, genre.GenreID);
      }

      res.status(200).json({ message: 'Song added to the database and linked to the user successfully' });
    } else {
      // If the song already exists, link the user to the existing song
      await userSongController.linkUserSong(userId, existingSong.SongID);

      res.status(200).json({ message: 'Song linked to the user successfully' });
    }
  } catch (error) {
    console.error('Error adding/linking song:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to add a custom song linked to a specific user to the database
router.post('/addCustomSong', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { title, performers, album, length, genres, releaseDate } = req.body;

    // Validate required parameters
    if (!title || !performers || !album || !length || !genres || !releaseDate) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required parameters: title, performers, album, length, genres, releaseDate',
      });
    }

    // Check if the song already exists in the database
    const existingSong = await songController.getSongByTitleAndAlbum(title, album);

    // If the song doesn't exist, create a new one
    let createdSong;
    if (!existingSong) {
      // Convert comma-separated string of performers and genres to arrays
      const performersArray = performers.split(',').map(performer => performer.trim());
      const genresArray = genres.split(',').map(genre => genre.trim());

      // Create a new custom song
      const newSong = {
        title,
        album,
        releaseDate,
        length,
        // Add other relevant song details
      };

      // Save the new song to the database
      createdSong = await songController.createSong(newSong);

      // Link the user to the newly created song
      await userSongController.linkUserSong(userId, createdSong.SongID);

      // Check if the performers exist and create them if not
      for (const performerName of performersArray) {
        let performer = await performerController.getPerformerByName(performerName);
        if (!performer) {
          performer = await performerController.createPerformer(performerName, null);
        }
        await songPerformerController.linkSongPerformer(createdSong.SongID, performer.PerformerID);
      }

      // Check if genres exist and create them if not
      for (const genreName of genresArray) {
        let genre = await genreController.getGenreByName(genreName);
        if (!genre) {
          genre = await genreController.createGenre(genreName);
        }
        await songGenreController.linkSongGenre(createdSong.SongID, genre.GenreID);
      }
    } else {
      // If the song already exists, link the user to the existing song
      await userSongController.linkUserSong(userId, existingSong.SongID);
      createdSong = existingSong;
    }

    res.json({
      status: 'success',
      message: 'Custom song added to the database and linked to the user successfully',
    });
  } catch (error) {
    console.error('Error adding custom song:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
});

// Route to get a song by title
router.get('/getSong/title', async (req, res) => {
  try {
    const title = req.body.title;
    if (!title) throw new Error('Title is a required parameter.');

    const song = await songController.getSongByTitle(title);
    if (song) {
      res.status(200).json(song);
    } else {
      res.status(404).json({ error: 'Song not found' });
    }
  } catch (error) {
    if (error.message === 'Title is a required parameter.') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Route to delete a song by ID
router.delete('/deleteSong', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { songId } = req.body;
  try {
    await removeSongFromUser(songId, userId);
    res.status(200).json({ message: 'Song deleted successfully' });
  } catch (error) {
    if (error.message.startsWith('User is not linked to the song')) {
      res.status(400).json({ error: error.message });
    } else if (error.message === 'Both songId and userId are required parameters.') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Route to delete all album songs
router.delete('/deleteAlbumSongs', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { albumName } = req.body;

  try {
    await deleteSongsByAlbum(albumName, userId);
    res.status(200).json({ message: `All songs from album ${albumName} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting songs from album ${albumName}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to find a song by SpotifyID
router.get('/getSong/spotifyID', async (req, res) => {
  try {
    const spotifyId = req.body.spotifyId;
    if (!spotifyId) throw new Error('Spotify ID is a required parameter.');

    const song = await songController.getSongBySpotifyID(spotifyId);
    if (song) {
      res.status(200).json(song);
    } else {
      res.status(404).json({ error: 'Song not found' });
    }
  } catch (error) {
    if (error.message === 'Spotify ID is a required parameter.') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Endpoint to get all songs for the logged-in user
router.get('/getAllUserSongs', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user-song links for the user
    const userSongLinks = await userSongController.getLinkByUser(userId);
    // Extract song IDs from the user-song links
    const songIds = userSongLinks.map(userSongLink => userSongLink.SongID);

    // Get songs based on the extracted song IDs
    const songs = [];
    for (const songId of songIds) {
      const song = await songController.getSongByID(songId);
      if (song) {
        songs.push(song);
      }
    }

    res.status(200).json(songs);
  } catch (error) {
    console.error('Error getting user songs:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add more routes as needed for other operations

module.exports = router;