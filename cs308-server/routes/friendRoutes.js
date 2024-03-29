const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const friendController = require('../controllers/friendController');
const songController = require('../controllers/songController');
const authenticateToken = require('../helpers/authToken');

// Add a friend via email
router.post('/addFriend', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendEmail } = req.body;

    // Check if the friend email is the same as the user email and email is not empty
    if (friendEmail === req.user.email || !friendEmail) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Invalid friend email',
      });
    }

    // Check if the friend user exists
    const friendUser = await userController.getUserByEmail(friendEmail);

    if (!friendUser) {
      return res.status(404).json({
        status: 'error',
        code: '404',
        message: 'Friend user not found',
      });
    }

    // Get the friendUserId from the retrieved user
    const friendUserId = friendUser.UserID;

    // Create the friend relationship
    const newFriendship = await friendController.createFriend(userId, friendUserId);
    await friendController.createFriend(friendUserId, userId);

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Friend is added successfully',
      data: newFriendship,
    });
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Get all friends
router.get('/getAllFriends', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const friends = await friendController.getFriendByUserId(userId);
    // Check if the user has any friends
    if (friends.length === 0) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'User has no friends',
      });
    } else {
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'All friends are obtained',
        data: friends,
      });
    }
  } catch (error) {
    console.error('Error getting all friends:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Get all songs of friends
router.get('/getAllFriendSongs', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all friends of the user
    const friends = await friendController.getFriendByUserId(userId);
    // Check if the user has any friends
    if (friends.length === 0) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'User has no friends',
      });
    }

    // Extract friend user IDs from the friends list
    const friendUserIds = friends.map(friend => friend.FriendInfo.UserID);

    // Get all songs of friends
    const friendSongs = await songController.getSongsByUserIds(friendUserIds);

    // Check if the user has any friend songs
    if (friendSongs.length === 0) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'User\'s friends has no songs',
      });
    } else {
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'All friend songs are obtained',
        data: friendSongs,
      });
    }
  } catch (error) {
    console.error('Error getting all friend songs:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
});

// Delete a friend by FriendID
router.post('/deleteFriend', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { friendUserId } = req.body;
      
      // Check if the friend user ID is the same as the user ID and friend user ID is not empty
      if (friendUserId === userId || !friendUserId) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Invalid friend user ID',
        });
      }
  
      // Check if the friend relationship exists
      const existingFriendship = await friendController.getFriendByUserIdAndFriendId(userId, friendUserId);
      if (existingFriendship.length === 0) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Friend is not found',
        });
      }
  
      // Delete the friend relationship
      const deletedFriend = await friendController.deleteFriendByFriendUserId(userId, friendUserId);
      await friendController.deleteFriendByFriendUserId(friendUserId, userId);
  
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Friend is deleted successfully',
        data: deletedFriend,
      });
    } catch (error) {
      console.error('Error deleting friend:', error);
      res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Internal Server Error',
      });
    }
});

module.exports = router;