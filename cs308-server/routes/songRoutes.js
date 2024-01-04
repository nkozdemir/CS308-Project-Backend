const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const userSongController = require('../controllers/userSongController'); 
const performerController = require('../controllers/performerController'); 
const songPerformerController = require('../controllers/songPerformerController'); 
const genreController = require('../controllers/genreController'); 
const songGenreController = require('../controllers/songGenreController'); 
const { deleteSong, removeSongFromUser } = require('../helpers/dbHelpers');
const { getArtistGenres, getArtistImages } = require('../helpers/spotifyHelpers');
const authenticateToken = require('../helpers/authToken');
const spotifyApi = require('../config/spotify.js');

// Route to add song to user by songId
router.post('/addSongById', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.body;

    // Check if songId is valid
    if (!songId) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Missing required parameter: songId',
      });
    }

    // Check if the song exists in the database
    const song = await songController.getSongById(songId);
    if (!song) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Song not found',
      });
    }

    // Link song to user
    await userSongController.linkUserSong(userId, songId);
    return res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Song linked to the user successfully',
      data: song,
    });
  } catch (error) {
    console.error('Error adding song:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Route to add songs linked to specific user, to database
router.post('/addSpotifySong', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { spotifyId } = req.body;

    // Validate required parameters
    if (!spotifyId) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Missing required parameter: spotifyId',
      });
    }

    // Fetch song details from Spotify API using the provided Spotify ID
    const spotifyApiResponse = await spotifyApi.getTrack(spotifyId);

    if (!spotifyApiResponse.body) {
      return res.status(404).json({ 
        status: 'error',
        code: 404,
        message: 'Song not found on Spotify' 
      });
    }

    const spotifyTrack = spotifyApiResponse.body;
    
    const artistInfo = spotifyTrack.artists.map(artist => ({
      name: artist.name,
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
          const images = await getArtistImages(artist.id);
          performer = await performerController.createPerformer(artist.name, artist.id, images);
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

      res.status(200).json({
        status: 'success',
        code: 200, 
        message: 'Song added to the database and linked to the user successfully', 
        data: createdSong
      });
    } else {
      // If the song already exists, link the user to the existing song
      await userSongController.linkUserSong(userId, existingSong.SongID);

      res.status(200).json({
        status: 'success',
        code: 200, 
        message: 'Song linked to the user successfully',
        data: existingSong 
      });
    }
  } catch (error) {
    console.error('Error adding/linking song:', error);
    res.status(500).json({
      status: 'error',
      code: 500, 
      message: 'Internal Server Error' 
    });
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
        status: 'error',
        code: 400,
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
          performer = await performerController.createPerformer(performerName, null, null);
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

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Custom song added to the database and linked to the user successfully',
      data: createdSong,
    });
  } catch (error) {
    console.error('Error adding custom song:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Route to get a song by title
router.post('/getSong/title', async (req, res) => {
  try {
    const title = req.body.title;

    // Check if title is valid
    if (!title) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Missing required parameter: title',
      });
    }

    const song = await songController.getSongByTitle(title);
    if (song) {
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Song retrieved successfully',
        data: song,
      });
    } else {
      return res.status(404).json({ 
        status: 'error',
        code: 404,
        message: 'Song not found' 
      });
    }
  } catch (error) {
    console.error('Error getting song by title:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Route to delete a song from user
router.post('/deleteSong/User', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.body;

    // Check if songId is valid
    if (!songId) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Missing required parameter: songId',
      });
    }

    const result = await removeSongFromUser(songId, userId);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Song removed from user successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ 
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Route to delete a song from the database
router.post('/deleteSong', authenticateToken, async (req, res) => {
  try {
    const { songId } = req.body;
    
    // Check if songId is valid
    if (!songId) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Missing required parameter: songId',
      });
    }

    const song = await songController.getSongByID(songId);
    if (!song) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Song not found',
      });
    }

    await deleteSong(songId);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Song removed from the database successfully',
      data: song,
    });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ 
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Route to delete all album songs
router.post('/deleteAlbumSongs', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { albumName } = req.body;

    // Check if albumName is valid
    if (!albumName) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Missing required parameter: albumName',
      });
    }

    await deleteSongsByAlbum(albumName, userId);
    res.status(200).json({ 
      status: 'success',
      code: 200,
      message: 'Songs removed from the database successfully',
      data: {},  
    });
  } catch (error) {
    console.error('Error deleting album songs:', error);
    res.status(500).json({ 
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Route to find a song by SpotifyID
router.post('/getSong/spotifyID', async (req, res) => {
  try {
    const spotifyId = req.body.spotifyId;

    // Check if spotifyId is valid
    if (!spotifyId) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Missing required parameter: spotifyId',
      });
    }

    const song = await songController.getSongBySpotifyID(spotifyId);
    if (song) {
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Song retrieved successfully',
        data: song,
      });
    } else {
      return res.status(404).json({ 
        status: 'error',
        code: 404,
        message: 'Song not found' 
      });
    }
  } catch (error) {
    console.error('Error getting song by Spotify ID:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Route to get all songs for the logged-in user
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

    // Check if the user has any songs
    if (songs.length === 0) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'No songs found for the user',
      });
    } else {
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Songs retrieved successfully',
        data: songs
      });
    }
  } catch (error) {
    console.error('Error getting user songs:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

module.exports = router;