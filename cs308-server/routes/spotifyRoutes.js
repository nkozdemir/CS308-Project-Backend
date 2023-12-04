const express = require('express');
const { setAccessToken, spotifyApi } = require('../services/spotifyService');
const { getArtistGenres, searchSong } = require('../helpers/spotifyHelpers');

const router = express.Router();

// Middleware to set the access token before handling routes
router.use(async (req, res, next) => {
  await setAccessToken();
  next();
});

// modify this or delete
router.get('/getTrackById', async (req, res) => {
  try {
    // Use the Spotify API to get information about a specific track
    const trackInfo = await spotifyApi.getTrack('4cOdK2wGLETKBW3PvgPWqT');
    res.json({
      status: 'success',
      data: trackInfo.body,
    });
  } catch (error) {
    console.error('Error during Spotify API request:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
});

router.get('/searchSong', async (req, res) => {
  try {
    const { trackName, performerName, albumName } = req.body;

    if (!trackName) {
      res.status(400).json({
        status: 'fail',
        message: 'Missing required parameter: trackName',
      });
      return;
    }

    const searchResults = await searchSong(trackName, performerName, albumName);

    res.json(searchResults);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
});


// Endpoint to fetch top x tracks from a Spotify playlist
router.get('/getTopTracksFromPlaylist', async (req, res) => {
  try {
    const { playlistId, numberOfResults } = req.body;

    if (!playlistId) {
      res.status(400).json({
        status: 'fail',
        message: 'Missing required parameter: playlistId',
      });
      return;
    }
    if (!numberOfResults) {
      res.status(400).json({
        status: 'fail',
        message: 'Missing required parameter: numberOfResults',
      });
      return;
    }

    // Use the Spotify API to get tracks from a playlist
    const data = await spotifyApi.getPlaylistTracks(playlistId);

    // Check if there are tracks in the response
    if (data.body.items && data.body.items.length > 0) {
      // check if requested number of tracks is valid
      if (numberOfResults > data.body.items.length) {
        res.status(400).json({
          status: 'fail',
          message: 'Requested number of tracks is greater than the number of tracks in the playlist',
        });
        return;
      }

      // Extract the first few tracks
      const trackResults = data.body.items.slice(0, numberOfResults);

      // Extract relevant information for each track
      const formattedResults = await Promise.all(trackResults.map(async (track) => {
        const artistInfo = track.track.artists.map(artist => ({
          name: artist.name,
          id: artist.id,
        }));

        return {
          SpotifyId: track.track.id,
          Title: track.track.name,
          Performer: artistInfo,
          Album: {
            id: track.track.album.id,
            name: track.track.album.name,
            type: track.track.album.album_type,
            release_date: track.track.album.release_date,
            images: track.track.album.images
          },
          Length: track.track.duration_ms,
          Genres: track.track.album.genres, // Associate album genres with each track
        };
      }));

      res.json({
        status: 'success',
        data: formattedResults,
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'No matching tracks found.',
      });
    }
  } catch (error) {
    console.error('Error during Spotify API request:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
});

module.exports = router;
