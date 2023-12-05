const express = require('express');
const router = express.Router();
const performerController = require('../controllers/performerController');
const songPerformerController = require('../controllers/songPerformerController');
const songGenreController = require('../controllers/songGenreController');
const userSongController = require('../controllers/userSongController');
const songController = require('../controllers/songController');
const authenticateToken = require('../helpers/authToken');
const spotifyApi = require('../config/spotify');

// Route to get all performers
router.get('/getAllPerformers', async (req, res) => {
  try {
    const performers = await performerController.getAllPerformers();
    return res.status(200).json({
        status: 'success', 
        code: 200,
        message: 'All performers retrieved',
        data: performers
    });
  } catch (err) {
    console.error('Error getting all performers: ', err);
    return res.status(500).json({
        status: 'error',
        code: 500, 
        message: 'Internal server error' 
    });
  }
});

// Route to get performer by id
router.get('/getPerformer/Id', async (req, res) => {
  try {
    const { performerId } = req.body;
    // Check if performer id is valid
    if (!performerId) {
      return res.status(400).json({
        status: 'error',
        code: 400, 
        message: 'Performer id is invalid' 
      });
    }

    const performer = await performerController.getPerformerById(performerId);
    // Check if performer exists
    if (!performer) {
      return res.status(404).json({
        status: 'error',
        code: 404, 
        message: 'Performer does not exist' 
      });
    }

    return res.status(200).json({
        status: 'success', 
        code: 200,
        message: 'Performer retrieved by id',
        data: performer
    });
  } catch (err) {
    console.error('Error getting performer by id: ', err);
    return res.status(500).json({
        status: 'error',
        code: 500, 
        message: 'Internal server error' 
    });
  }
});

// Route to get performer by spotify id
router.get('/getPerformer/SpotifyId', async (req, res) => {
  try {
    const { spotifyId } = req.body;
    // Check if spotify id is valid
    if (!spotifyId) {
        return res.status(400).json({
            status: 'error',
            code: 400,
            message: 'Spotify id is invalid'
        });
    }
    
    const performer = await performerController.getPerformerBySpotifyID(spotifyId);
    // Check if performer exists
    if (!performer) {
        return res.status(404).json({
            status: 'error',
            code: 404, 
            message: 'Performer does not exist' 
        });
    }

    return res.status(200).json({
        status: 'success', 
        code: 200,
        message: 'Performer retrieved by SpotifyId',
        data: performer
    });
  } catch (err) {
    console.error('Error getting performer by spotify id: ', err);
    return res.status(500).json({
        status: 'error',
        code: 500, 
        message: 'Internal server error' 
    });
  }
});

// Route to get performer from spotify by its spotifyId
router.get('/getPerformer/Spotify', async (req, res) => {
  try {
    const { spotifyId } = req.body;
    // check if spotify id is valid
    if (!spotifyId) {
        return res.status(400).json({
            status: 'error',
            code: 400,
            message: 'Spotify id is invalid'
        });
    }

    let performer;
    try {
        performer = await spotifyApi.getArtist(spotifyId);
        //console.log(performer);
    }
    catch (err) {
        return res.status(404).json({
            status: 'error',
            code: 404, 
            message: 'Performer does not exist on Spotify' 
        });
    }

    const formattedPerformer = {
        name: performer.body.name,
        spotifyId: performer.body.id,
        genres: performer.body.genres,
        imageUrl: performer.body.images,
    };

    return res.status(200).json({
        status: 'success', 
        code: 200,
        message: 'Performer retrieved from Spotify',
        data: formattedPerformer
    });
  } catch (err) {
    console.error('Error getting performer by spotify id: ', err);
    return res.status(500).json({
        status: 'error',
        code: 500, 
        message: 'Internal server error' 
    });
  }
});

// Route to get performer by name
router.get('/getPerformer/Name', async (req, res) => {
  try {
    const { performerName } = req.body;
    // Check if performer name is valid
    if (!performerName) {
        return res.status(400).json({
            status: 'error',
            code: 400,
            message: 'Performer name is invalid'
        });
    }

    const performer = await performerController.getPerformerByName(performerName);
    // Check if performer exists
    if (!performer) {
        return res.status(404).json({
            status: 'error',
            code: 404, 
            message: 'Performer does not exist' 
        });
    }

    return res.status(200).json({
        status: 'success', 
        code: 200,
        message: 'Performer retrieved by name',
        data: performer
    });
  } catch (err) {
    console.error('Error getting performer by name: ', err);
    return res.status(500).json({
        status: 'error',
        code: 500, 
        message: 'Internal server error' 
    });
  }
});

// Route to delete performer
router.delete('/deletePerformer', authenticateToken, async (req, res) => {
  try {
    const { performerId } = req.body;
    // Check if performer id is valid
    if (!performerId) {
      return res.status(400).json({
        status: 'error',
        code: 400, 
        message: 'Performer id is invalid' 
      });
    }

    // Check if the performer exists in the database
    const existingPerformer = await performerController.getPerformerById(performerId);

    // If the performer doesn't exist, return an error
    if (!existingPerformer) {
      return res.status(404).json({
        status: error,
        code: 404, 
        message: 'Performer does not exist'
      });
    }

    // From SongPerformer table, get all song related to the performer
    const performerSongs = await songPerformerController.getLinkByPerformer(performerId);

    // For the songs inside performerSongs, delete corresponding rows in SongGenre and UserSong tables
    for (const song of performerSongs) {
      await songGenreController.deleteSongGenre(song.SongID);
      await userSongController.deleteUserSongBySongId(song.SongID);
    }

    // Delete performer from SongPerformer table
    await songPerformerController.deleteSongPerformerByPerformerId(performerId);

    // Delete songs inside performerSongs from Song table using deleteSong method in songController
    for (const song of performerSongs) {
      await songController.deleteSong(song.SongID);
    }

    // Delete performer from Performer table
    await performerController.deletePerformerByPerformerId(performerId);

    return res.status(200).json({
        status: 'success', 
        code: 200,
        message: 'Performer deleted',
        data: existingPerformer
    });
  } catch (err) {
    console.error('Error deleting performer: ', err);
    return res.status(500).json({
        status: 'error',
        code: 500, 
        message: 'Internal server error' 
    });
  }
});

module.exports = router;