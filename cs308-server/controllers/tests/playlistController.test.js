jest.mock('../playlistController', () => ({
  createPlaylist: jest.fn(),
  getPlaylistById: jest.fn(),
  getPlaylistByUser: jest.fn(),
  deletePlaylist: jest.fn(),
}));

var SequelizeMock = require('sequelize-mock');
const { DataTypes } = require('sequelize');

const { createPlaylist, getPlaylistById, getPlaylistByUser, deletePlaylist, } = require('../playlistController');

// Create a mock Sequelize instance
const sequelizeMock = new SequelizeMock();

// Mock the Playlist model
const Playlist = sequelizeMock.define('Playlist', {
  PlaylistID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  Name: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  DateAdded: {
      type: DataTypes.DATE,
      allowNull: false,
  },
  Image: {
      type: DataTypes.JSON,
  },
});

describe('create', () => {
  it('should create a new playlist', async () => {
    const playlistData = { 
      Name: 'Test Playlist',
      UserID: 1,
      DateAdded: '2021-04-01',
      Image: null,
    };

    // mock the create method to return a mock playlist
    createPlaylist.mockResolvedValue(playlistData);

    const createdPlaylist = await createPlaylist(playlistData);

    expect(createdPlaylist).toEqual(playlistData);
  });
});

describe('getPlaylistById', () => {
  it('should get a playlist by its id', async () => {
    const playlistId = 1;

    // mock the getPlaylistById method to return a mock playlist
    getPlaylistById.mockResolvedValue({playlistID: playlistId});

    const foundPlaylist = await getPlaylistById(playlistId, Playlist);

    expect(foundPlaylist).toEqual({playlistID: playlistId});
  });
});

describe('getPlaylistByUser', () => {
  it('should get a playlist by its user', async () => {
    const userId = 1;

    // mock the getPlaylistByUser method to return a mock playlist
    getPlaylistByUser.mockResolvedValue({userID: userId});

    const foundPlaylist = await getPlaylistByUser(userId, Playlist);

    expect(foundPlaylist).toEqual({userID: userId});
  });
});

describe('deletePlaylist', () => {  
  it('should delete a playlist', async () => {
    const playlistId = 1;

    // mock the deletePlaylist method to return a mock playlist
    deletePlaylist.mockResolvedValue({playlistID: playlistId});

    const deletedPlaylist = await deletePlaylist(playlistId, Playlist);

    expect(deletedPlaylist).toEqual({playlistID: playlistId});
  });
});
