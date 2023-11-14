const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const authenticateToken = require('../authentication/authServer'); // middleware for authentication??

// Route to get all songs
router.get('/songs', songController.getAllSongs);

// Route to get songs by user ID
router.get('/user-songs', authenticateToken, songController.getSongsByUserId);

// Add other routes as needed

module.exports = router;
