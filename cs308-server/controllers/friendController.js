const Friend = require('../models/friend');
const userController = require('../controllers/userController');
const User = require('../models/user');

async function createFriend(userId, friendUserId) {
  try {
    // Check if the friendship already exists
    const existingFriendship = await Friend.findOne({
        where: {
          UserID: userId,
          FriendUserID: friendUserId,
        },
      });
  
    if (existingFriendship) {
        // Friendship already exists, return existing instance
        return existingFriendship;
    }
    const friend = await Friend.create({
      UserID: userId,
      FriendUserID: friendUserId,
    });
    return friend;
  } catch (error) {
    console.error('Error creating friend:', error);
    throw error;
  }
}

async function deleteFriendByFriendUserId(userId, friendUserId) {
    try {
      // Retrieve the friend relationship to be deleted
      const friendToDelete = await Friend.findOne({
          where: {
              UserID: userId,
              FriendUserID: friendUserId,
          },
      });

      if (!friendToDelete) {
          // If the friend relationship does not exist, you can handle it accordingly
          throw new Error('Friend relationship not found');
      }
      await Friend.destroy({
        where: {
          UserID: userId,
          FriendUserID: friendUserId,
        },
      });
      return friendToDelete;
    } catch (error) {
      console.error('Error deleting friend by FriendUserID:', error);
      throw error;
    }
}

async function getFriendByUserId(userId) {
    try {
      // Retrieve friends of the current user (userId) along with their user information
      const friends = await Friend.findAll({
        where: {
          UserID: userId,
        },
        include: {
          model: User,
          as: 'FriendInfo',
          attributes: ['UserID', 'Name', 'Email'],
        },
      });
  
      return friends;
    } catch (error) {
      console.error('Error getting friends:', error);
      throw error;
    }
  }

  async function getFriendByUserIdAndFriendId(userId, friendUserId) {
    try {
      const friend = await Friend.findAll({
        where: {
          UserID: userId,
          FriendUserID: friendUserId,
        },
      });
  
      return friend;
    } catch (error) {
      console.error('Error getting friend:', error);
      throw error;
    }
  }

async function getMutualFriends(userId, friendUserId) {
    try {
      // Retrieve friends of the current user (userId)
      const friendsOfUser = await Friend.findAll({
        where: {
          UserID: userId,
        },
      });
  
      // Retrieve friends of the specified friend user (friendUserId)
      const friendsOfFriendUser = await Friend.findAll({
        where: {
          UserID: friendUserId,
        },
      });
  
      // Find mutual friends by comparing the two lists
      const mutualFriends = friendsOfUser.filter((friend) =>
        friendsOfFriendUser.some((friendOfFriendUser) =>
          friend.FriendUserID === friendOfFriendUser.FriendUserID
        )
      );
  
      return mutualFriends;
    } catch (error) {
      console.error('Error getting mutual friends:', error);
      throw error;
    }
}


  

module.exports = {
  createFriend,
  deleteFriendByFriendUserId,
  getFriendByUserId,
  getFriendByUserIdAndFriendId,
  getMutualFriends,
  // You can add other friend-related controller functions here as needed
};
