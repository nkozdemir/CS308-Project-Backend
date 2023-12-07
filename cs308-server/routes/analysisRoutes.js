const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const userSongController = require('../controllers/userSongController'); 
const performerController = require('../controllers/performerController'); 
const songPerformerController = require('../controllers/songPerformerController'); 
const genreController = require('../controllers/genreController'); 
const songGenreController = require('../controllers/songGenreController'); 
const songRatingController = require('../controllers/songRatingController'); 

const authenticateToken = require('../helpers/authToken');
const spotifyApi = require('../config/spotify.js');

// Route to get songs by decade
router.post('/getSongsByDecade', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const latestRating = await songRatingController.getLatestRatingByUserSong(userId, 57); // Replace with actual values
    console.log("LOG: ", latestRating);

    const { decade } = req.body;
    if (!decade) throw new Error('Decade is a required parameter.');

    // Retrieve songs from the specified decade
    const songsInDecade = await songController.getUserSongsByDecade(userId, decade);

    res.status(200).json({
      status: 'success',
      code: 200,
      data: songsInDecade,
    });
  } catch (error) {
    if (error.message === 'Decade is a required parameter.') {
      res.status(400).json({ error: error.message });
    } else {
      console.error('Error getting songs by decade:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Add more routes as needed for other operations

module.exports = router;