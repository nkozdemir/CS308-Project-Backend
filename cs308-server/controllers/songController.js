const Song = require('../models/song');

// Controller function to get all songs
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.findAll();
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Controller function to get songs by user ID
exports.getSongsByUserId = async (req, res) => {
  const userId = req.user.UserID; // Assuming you have a middleware to attach user information to the request (not added yet)
  try {
    const userSongs = await Song.findAll({ where: { userid: userId } });
    res.json(userSongs);
  } catch (error) {
    console.error('Error fetching user songs:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Add other controller functions as needed
