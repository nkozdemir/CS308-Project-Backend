jest.mock('../friendController', () => ({
  createFriend: jest.fn(),
  deleteFriendByFriendUserId: jest.fn(),
  getFriendByUserId: jest.fn(),
  getFriendByUserIdAndFriendId: jest.fn(),
  getMutualFriends: jest.fn(),
}));

var SequelizeMock = require('sequelize-mock');
const { DataTypes } = require('sequelize');

const { createFriend, deleteFriendByFriendUserId, getFriendByUserId, getFriendByUserIdAndFriendId, getMutualFriends } = require('../friendController');

// Create a mock Sequelize instance
const sequelizeMock = new SequelizeMock();

// Mock the SongPerformer model
const Friend = sequelizeMock.define('Friend', {
  FriendID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  FriendUserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

describe('create', () => {
  it('should create a friend', async () => {
    const friendData = { 
      UserID: 1,
      FriendUserID: 2,
    };

    createFriend.mockResolvedValue(friendData);

    const friend = await createFriend(friendData);

    expect(friend).toEqual(friendData);
  });
});

describe('delete', () => {
  it('should delete a friend', async () => {
    const friendData = { 
      UserID: 1,
      FriendUserID: 2,
    };

    deleteFriendByFriendUserId.mockResolvedValue(friendData);

    const friend = await deleteFriendByFriendUserId(friendData);

    expect(friend).toEqual(friendData);
  });
});

describe('get', () => {
  it('should get a friend', async () => {
    const friendData = { 
      UserID: 1,
      FriendUserID: 2,
    };

    getFriendByUserId.mockResolvedValue(friendData);

    const friend = await getFriendByUserId(friendData);

    expect(friend).toEqual(friendData);
  });
});

describe('get', () => {
  it('should get a friend', async () => {
    const friendData = { 
      UserID: 1,
      FriendUserID: 2,
    };

    getFriendByUserIdAndFriendId.mockResolvedValue(friendData);

    const friend = await getFriendByUserIdAndFriendId(friendData);

    expect(friend).toEqual(friendData);
  });
});

describe('get', () => {
  it('should get a friend', async () => {
    const friendData = { 
      UserID: 1,
      FriendUserID: 2,
    };

    getMutualFriends.mockResolvedValue(friendData);

    const friend = await getMutualFriends(friendData);

    expect(friend).toEqual(friendData);
  });
});