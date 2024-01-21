jest.mock('../playlistSongController', () => ({
  createPlaylistSong: jest.fn(),
  getPlaylistSongByPlaylist: jest.fn(),
  deletePlaylistSong: jest.fn(),
  deletePlaylistSongByPlaylist: jest.fn(),
}));

var SequelizeMock = require('sequelize-mock');
const { DataTypes } = require('sequelize');

const {
  createPlaylistSong,
  getPlaylistSongByPlaylist,
  deletePlaylistSong,
  deletePlaylistSongByPlaylist,
} = require('../playlistSongController');

// Create a mock Sequelize instance
const sequelizeMock = new SequelizeMock();

// Mock the Playlist model
const PlaylistSong = sequelizeMock.define('PlaylistSong', {
  PlaylistSongID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  PlaylistID: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  SongID: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
});

describe('create', () => {
  it('should create a new playlist song', async () => {
    const playlistSongData = {
      PlaylistID: 1,
      SongID: 1,
    };

    // mock the create method to return a mock playlist song
    createPlaylistSong.mockResolvedValue(playlistSongData);

    const createdPlaylistSong = await createPlaylistSong(playlistSongData);

    expect(createdPlaylistSong).toEqual(playlistSongData);
  });
});

describe('getPlaylistSongByPlaylist', () => {
  it('should get a playlist song by its playlist', async () => {
    const playlistIds = [1, 2, 3];

    // mock the findAll method to return mock playlist songs
    getPlaylistSongByPlaylist.mockResolvedValue([{PlaylistID: playlistIds[0]}, {PlaylistID: playlistIds[1]}, {PlaylistID: playlistIds[2]}]);

    const foundPlaylistSong = await getPlaylistSongByPlaylist(playlistIds, PlaylistSong);

    expect(foundPlaylistSong).toEqual([{PlaylistID: playlistIds[0]}, {PlaylistID: playlistIds[1]}, {PlaylistID: playlistIds[2]}]);
  });
});

describe('deletePlaylistSong', () => {
  it('should delete a playlist song', async () => {
    const playlistSongData = {
      PlaylistID: 1,
      SongID: 1,
    };

    // mock the destroy method to return a mock playlist song
    deletePlaylistSong.mockResolvedValue(playlistSongData);

    const deletedPlaylistSong = await deletePlaylistSong(playlistSongData);

    expect(deletedPlaylistSong).toEqual(playlistSongData);
  });
});

describe('deletePlaylistSongByPlaylist', () => {
  it('should delete a playlist song by its playlist', async () => {
    const playlistId = 1;

    // mock the destroy method to return a mock playlist song
    deletePlaylistSongByPlaylist.mockResolvedValue({PlaylistID: playlistId});

    const deletedPlaylistSong = await deletePlaylistSongByPlaylist(playlistId);

    expect(deletedPlaylistSong).toEqual({PlaylistID: playlistId});
  });
});