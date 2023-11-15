const router = require('express').Router();
//const songController = require('../controllers/songController');

const songData = [
  {
    userid: 1,
    songid: 1,
  },
  {
    userid: 1,
    songid: 2,
  },
  {
    userid: 1,
    songid: 3,
  },
  {
    userid: 2,
    songid: 2,
  },
  {
    userid: 2,
    songid: 3,
  },
]

// Route to get all songs
//router.get('/songs', songController.getAllSongs);

// Route to get songs by user ID

// Example method
router.get('/usersong', (req, res) => {
  res.json(songData.filter((data) => data.userid === req.user.UserID));
})

// Add other routes as needed

module.exports = router;