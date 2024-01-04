const express = require('express');
const router = express.Router();
const { setAccessToken } = require('../services/spotifyService');
const { searchSong } = require('../helpers/spotifyHelpers');
const authenticateToken = require('../helpers/authToken');

// Middleware to set the access token before handling routes
router.use(async (req, res, next) => {
  await setAccessToken();
  next();
});

router.post('/searchSong', authenticateToken, async (req, res) => {
  try {
    const { trackName, performerName, albumName } = req.body;

    if (!trackName) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Missing required parameter: trackName',
      });
    }

    const searchResults = await searchSong(trackName, performerName, albumName);

    if (searchResults.data === null) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'No matching tracks found.',
      });
    }
    else {
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Successfully retrieved search results',
        data: searchResults.data,
      });
    }
  } catch (error) {
    console.error('Error during Spotify API request:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

module.exports = router;