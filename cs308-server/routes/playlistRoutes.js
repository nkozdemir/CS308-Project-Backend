const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const playlistSongController = require('../controllers/playlistSongController');
const songController = require('../controllers/songController');
const userSongController = require('../controllers/userSongController');
const authenticateToken = require('../helpers/authToken');

// Route to get all playlists for a user
router.get('/getAllUserPlaylists', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const playlists = await playlistController.getPlaylistByUser(userId);

    if (playlists.length === 0) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'No playlist found for user',
      });
    }

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

// Route to create a playlist optionally with a list of song ids
router.post('/createPlaylist', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { playlistName, songIDs } = req.body;
    if (!playlistName) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Invalid parameter. Playlist name must be provided.',
      });
    }
    const playlist = await playlistController.createPlaylist(playlistName, userId);
    if(songIDs.length !== 0) {
      for (const songID of songIDs) {
        await playlistSongController.createPlaylistSong(playlist.PlaylistID, songID);
      }
    }
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
    await playlistSongController.deletePlaylistSongByPlaylist(playlistID);
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

// Route to add songs to a playlist
router.post('/addSongsToPlaylist', authenticateToken, async (req, res) => {
  try {
    const { playlistID, songIDs } = req.body;
    if (!playlistID || !songIDs) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Invalid parameters. Playlist ID and song IDs must be provided.',
      });
    }
    for (const songID of songIDs) {
      await playlistSongController.createPlaylistSong(playlistID, songID);
    }
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Songs added to playlist successfully',
    });
  } catch (error) {
    console.error('Error adding songs to playlist:', error);
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

    if (playlistSongs.length === 0) {
        return res.status(404).json({
            status: 'error',
            code: 404,
            message: 'No songs found for playlist',
        });
    }
    
    const songs = [];
    for (const playlistSong of playlistSongs) {
      const song = await songController.getSongByID(playlistSong.SongID);
      songs.push(song);
    }

    if (songs.length === 0) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'No songs found for playlist',
      });
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

router.post('/getSongsToAdd', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { playlistID } = req.body;
    if (!playlistID) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Invalid parameters. Playlist ID must be provided.',
      });
    }

    const playlistSongs = (await playlistSongController.getPlaylistSongByPlaylist(playlistID)).map(playlistSong => playlistSong.SongID);

    // Get user-song links for the user
    const userSongLinks = await userSongController.getLinkByUser(userId);
    // Extract song IDs from the user-song links
    let songIds = userSongLinks.map(userSongLink => userSongLink.SongID);

    // In songIds, remove the song IDs that are already in the playlist
    for (const playlistSong of playlistSongs) {
      const index = songIds.indexOf(playlistSong);
      if (index > -1) {
        songIds.splice(index, 1);
      }
    }

    // Get the songs with songIds
    const songs = [];
    for (const songId of songIds) {
      const song = await songController.getSongByID(songId);
      songs.push(song);
    }

    if (!songs || songs.length === 0) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'No songs found to add to playlist',
      });
    } else {
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Songs retrieved successfully',
        data: songs,
      });
    }
  } catch (error) {
    console.error('Error getting songs to add to playlist:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

module.exports = router;