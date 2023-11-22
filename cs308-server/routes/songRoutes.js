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
const { authenticateToken } = require('../index');


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

const userSongController = require('../controllers/userSongController'); // Import the userSongController

// Endpoint to get all songs for the logged-in user
router.get('/getAllUserSongs', /* authenticateToken, */ async (req, res) => {
  try {
    //const userId = req.user.id; // Assuming the user ID is stored in the 'id' field of the authentication token
    const { userId } = req.body;

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

    res.json(songs);
  } catch (error) {
    console.error('Error getting user songs:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;


// Add more routes as needed for other operations

module.exports = router;