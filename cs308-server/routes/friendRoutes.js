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
  
      // Check if the friend user exists
      const friendUser = await userController.getUserByEmail(friendEmail);
  
      if (!friendUser) {
        return res.status(404).json({
          status: 'error',
          message: 'Friend user not found',
        });
      }
  
      // Get the friendUserId from the retrieved user
      const friendUserId = friendUser.UserID;
  
      // Create the friend relationship
      const newFriendship = await friendController.createFriend(userId, friendUserId);
  
      res.status(201).json({
        status: 'success',
        data: newFriendship,
      });
    } catch (error) {
      console.error('Error adding friend:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
});

// Get all friends
router.get('/getAllFriends', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
  
      const friends = await friendController.getFriendByUserId(userId);
      
      res.status(201).json({
        status: 'success',
        data: friends,
      });
    } catch (error) {
      console.error('Error getting all friends:', error);
      res.status(500).json({
        status: 'error',
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
  
      // Extract friend user IDs from the friends list
      const friendUserIds = friends.map(friend => friend.FriendInfo.UserID);
  
      // Get all songs of friends
      const friendSongs = await songController.getSongsByUserIds(friendUserIds);
  
      res.status(200).json({
        status: 'success',
        data: friendSongs,
      });
    } catch (error) {
      console.error('Error getting all friend songs:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  });

// Delete a friend by FriendID
router.delete('/deleteFriend', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { friendUserId } = req.body;
  
      // Check if the friend relationship exists
      const existingFriendship = await friendController.getFriendByUserIdAndFriendId(userId, friendUserId);
      if (existingFriendship.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Friend is not found',
        });
      }
  
      // Delete the friend relationship
      await friendController.deleteFriendByFriendUserId(userId, friendUserId);
  
      res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      console.error('Error deleting friend:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
});

module.exports = router;