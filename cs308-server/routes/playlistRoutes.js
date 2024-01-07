const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const playlistSongController = require('../controllers/playlistSongController');
const songController = require('../controllers/songController');
const authenticateToken = require('../helpers/authToken');

// Route to get all playlists for a user
router.get('/getAllUserPlaylists', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const playlists = await playlistController.getPlaylistByUser(userId);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Playlists retrieved successfully',
      data: playlists,
    });
  } catch (error) {
    console.error('Error getting playlists:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Route to create a playlist
router.post('/createPlaylist', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { playlistName } = req.body;
    if (!playlistName) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Invalid parameters. Playlist name must be provided.',
      });
    }
    const playlist = await playlistController.createPlaylist(playlistName, userId);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Playlist created successfully',
      data: playlist,
    });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Route to delete a playlist
router.post('/deletePlaylist', authenticateToken, async (req, res) => {
  try {
    const { playlistID } = req.body;
    if (!playlistID) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Invalid parameters. Playlist ID must be provided.',
      });
    }
    const playlist = await playlistController.deletePlaylist(playlistID);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Playlist deleted successfully',
      data: playlist,
    });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Route to add a song to a playlist
router.post('/addSongToPlaylist', authenticateToken, async (req, res) => {
  try {
    const { playlistID, songID } = req.body;
    if (!playlistID || !songID) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Invalid parameters. Playlist ID and song ID must be provided.',
      });
    }
    const playlistSong = await playlistSongController.createPlaylistSong(playlistID, songID);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Song added to playlist successfully',
      data: playlistSong,
    });
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Route to delete a song from a playlist
router.post('/deleteSongFromPlaylist', authenticateToken, async (req, res) => {
  try {
    const { playlistID, songID } = req.body;
    if (!playlistID || !songID) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Invalid parameters. Playlist ID and song ID must be provided.',
      });
    }
    const playlistSong = await playlistSongController.deletePlaylistSong(playlistID, songID);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Song deleted from playlist successfully',
      data: playlistSong,
    });
  } catch (error) {
    console.error('Error deleting song from playlist:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Route to get all songs for a playlist
router.post('/getAllSongsForPlaylist', authenticateToken, async (req, res) => {
  try {
    const { playlistID } = req.body;
    if (!playlistID) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Invalid parameters. Playlist ID must be provided.',
      });
    }
    const playlistSongs = await playlistSongController.getPlaylistSongByPlaylist(playlistID);
    const songs = [];
    for (const playlistSong of playlistSongs) {
      const song = await songController.getSongByID(playlistSong.SongID);
      songs.push(song);
    }
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Songs retrieved successfully',
      data: songs,
    });
  } catch (error) {
    console.error('Error getting songs for playlist:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

module.exports = router;