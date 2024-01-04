const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const songRatingController = require('../controllers/songRatingController'); 
const authenticateToken = require('../helpers/authToken');

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
router.post('/getTopRatedSongsFromLastMonths', authenticateToken, async (req, res) => {
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

    topRatedUserSongs.sort((a, b) => {
      const ratingA = a.SongRatingInfo[0]?.Rating || 0; // Default to 0 if undefined
      const ratingB = b.SongRatingInfo[0]?.Rating || 0; // Default to 0 if undefined
    
      return ratingB - ratingA;
    });
    
    const top10RatedUserSongs = topRatedUserSongs.slice(0, 10);

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Top-rated user songs from the last month(s) retrieved successfully',
      data: top10RatedUserSongs,
    });
  } catch (error) {
    console.error('Error getting top-rated user songs from the last month(s):', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Route to get daily average ratings in the last n days
router.post('/getDailyAverageRating', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { day } = req.body;

    // Check if the day is valid
    if (!day || day <= 0) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Invalid parameters. Day must be provided and be a positive integer.',
      });
    }

    // Calculate the start and end dates
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - day);
    
    // Retrieve song ratings for the user within the last month
    const songRatingsInMonth = await songRatingController.getRatingsByDateRange(userId, startDate, endDate);

    // Group ratings by day
    const ratingsByDay = songRatingController.groupRatingsByDay(songRatingsInMonth);

    // Calculate the daily average ratings
    const dailyAverageRatings = songRatingController.calculateDailyAverageRatings(ratingsByDay);

    // Send the response
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Daily average ratings retrieved successfully',
      data: dailyAverageRatings,
    });
  } catch (error) {
    console.error('Error fetching daily average rating:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

module.exports = router;