const express = require('express');
const router = express.Router();
const performerController = require('../controllers/performerController');
const songPerformerController = require('../controllers/songPerformerController');
const songGenreController = require('../controllers/songGenreController');
const userSongController = require('../controllers/userSongController');
const songController = require('../controllers/songController');
const authenticateToken = require('../helpers/authToken');

// Route to delete performer
router.delete('/deletePerformer', async (req, res) => {
  try {
    const { performerId } = req.body;

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