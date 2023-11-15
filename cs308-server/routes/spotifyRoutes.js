const express = require('express');
const { setAccessToken, spotifyApi } = require('../services/spotifyService');

const router = express.Router();

// Middleware to set the access token before handling routes
router.use(async (req, res, next) => {
  await setAccessToken();
  next();
});

router.get('/getTrackById', async (req, res) => {
  try {
    // Use the Spotify API to get information about a specific track
    const trackInfo = await spotifyApi.getTrack('4cOdK2wGLETKBW3PvgPWqT');
    res.json(trackInfo.body);
  } catch (error) {
    console.error('Error during Spotify API request:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/filterSongByArtist', async (req, res) => {
  try {
    const { trackName, artistName } = req.query;

    if (!trackName || !artistName) {
      return res.status(400).send('Missing required parameters: trackName and artistName');
    }

    // Use the Spotify API to search for tracks
    const data = await spotifyApi.searchTracks(`track:${trackName} artist:${artistName}`);

    // Check if there are tracks in the response
    if (data.body.tracks && data.body.tracks.items.length > 0) {
      const numberOfResults = 3;

      // Extract the first few tracks
      const trackResults = data.body.tracks.items.slice(0, numberOfResults);

      // Extract relevant information for each track
      const formattedResults = trackResults.map(track => ({
        name: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        album: track.album.name,
      }));

      res.json(formattedResults);
    } else {
      res.status(404).send('No matching tracks found.');
    }
  } catch (error) {
    console.error('Error during Spotify API request:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
