/*
Notes:
- Add song method only adds songs to the db using getTopTracksFromPlaylist() method (for development purposes)
- To be modified in the future
*/
const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const { removeSongFromDatabase, addSongsToDatabase } = require('../helpers/dbHelpers');
const { getTopTracksFromPlaylist } = require('../helpers/spotifyHelpers');

// Route to add songs linked to specific user, to database
router.post('/addSong', async (req, res) => {
  const { userId } = req.body;
  const request = {
    playlistId: '37i9dQZF1DXcBWIGoYBM5M', // Today's top hits https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
    numberOfResults: 3,
  }
  let songData;
  try {
    songData = await getTopTracksFromPlaylist(request.playlistId, request.numberOfResults);
  } catch (error) {
    if (error.message.startsWith('Missing required parameters')) {
      res.status(400).json({ error: error.message });
    } else if (error.message.startsWith('Requested number of tracks is greater than the number of tracks in the playlist')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  try {
    await addSongsToDatabase(songData, userId);
    res.status(200).json({ message: 'Songs added to the database successfully' });
  } catch (error) {
    if (error.message.startsWith('User with ID')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Route to get a song by title
router.get('/getSong/title', async (req, res) => {
  try {
    const title = req.body.title;
    const song = await songController.getSongByTitle(title);
    if (song) {
      res.status(200).json(song);
    } else {
      res.status(404).json({ error: 'Song not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a song by ID
router.delete('/deleteSong', async (req, res) => {
  const { songId, userId } = req.body;
  try {
    await removeSongFromDatabase(songId, userId);
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

// Route to find a song by SpotifyID
router.get('/getSong/spotifyID', async (req, res) => {
  try {
    const spotifyId = req.body.spotifyId;
    const song = await songController.getSongBySpotifyID(spotifyId);
    if (song) {
      res.status(200).json(song);
    } else {
      res.status(404).json({ error: 'Song not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add more routes as needed for other operations

module.exports = router;