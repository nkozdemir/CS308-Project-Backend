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

// Route to get top-rated songs by decade
router.post('/getTopRatedSongsByDecade', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { decade, count } = req.body;
      if (!decade || !count || count <= 0) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Invalid parameters. Decade and count must be provided, and count must be a positive integer.',
        });
      }
  
      // Retrieve songs from the specified decade
      const songsInDecade = await songController.getUserSongsByDecade(userId, decade);
  
      // Retrieve latest ratings for user songs in the specified decade
      const latestRatings = await songRatingController.getLatestRatingsForUserSongs(userId);
  
      // Filter ratings for songs in the specified decade
      const ratingsInDecade = latestRatings.filter(rating =>
        songsInDecade.some(song => song.SongID === rating.SongID)
      );
  
      // Sort the ratings in descending order based on the Rating value
      const sortedRatings = ratingsInDecade.sort((a, b) => b.Rating - a.Rating);
  
      // Get the top X rated user songs
      const songRatings = sortedRatings.slice(0, count);

      const songIds = songRatings.map(link => link.SongID);
      const topRatedUserSongs = await songController.getSongsBySongIds(songIds);
  
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Top-rated user songs from the decade retrieved successfully',
        data: topRatedUserSongs,
      });
    } catch (error) {
      console.error('Error getting top-rated user songs by decade:', error);
      res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Internal Server Error',
      });
    }
  });
  
// Route to get top-rated songs added in last n months
router.post('/getTopRatedSongsByLastMonths', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { month } = req.body;
      if (!month || month <= 0) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Invalid parameters. Month must be provided and be a positive integer.',
        });
      }

      const topRatedUserSongs = await songController.getUserSongsByMonth(userId, month);
  
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Top-rated user songs from the last ${month} month(s) retrieved successfully',
        data: topRatedUserSongs,
      });
    } catch (error) {
      console.error('Error getting top-rated user songs from the last ${month} month(s):', error);
      res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Internal Server Error',
      });
    }
  });

// Add more routes as needed for other operations

module.exports = router;