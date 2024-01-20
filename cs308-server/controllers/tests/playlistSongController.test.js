const playlistSongModel = require('../../models/playlistSong');
const {
  createPlaylistSong,
  getPlaylistSongByPlaylist,
  deletePlaylistSong,
  deletePlaylistSongByPlaylist,
} = require('../playlistSongController');

jest.mock('../../models/playlistSong');

describe('createPlaylistSong', () => {
  it('should create a playlist song with the given playlistID and songID', async () => {
    const playlistID = 1;
    const songID = 1;

    const mockPlaylistSong = {
      id: 1,
      PlaylistID: playlistID,
      SongID: songID,
    };

    playlistSongModel.create.mockResolvedValue(mockPlaylistSong);

    const createdPlaylistSong = await createPlaylistSong(playlistID, songID);

    expect(playlistSongModel.create).toHaveBeenCalledWith({
      PlaylistID: playlistID,
      SongID: songID,
    });

    expect(createdPlaylistSong).toEqual(mockPlaylistSong);
  });

  it('should throw an error if there is an error creating the playlist song', async () => {
    const playlistID = 1;
    const songID = 1;

    const mockError = new Error('Failed to create playlist song');
    playlistSongModel.create.mockRejectedValue(mockError);

    await expect(createPlaylistSong(playlistID, songID)).rejects.toThrowError('Failed to create playlist song');
  });
});

describe('getPlaylistSongByPlaylist', () => {
  it('should get playlist songs by playlistID', async () => {
    const playlistID = 1;

    const mockPlaylistSongs = [
      {
        id: 1,
        PlaylistID: playlistID,
        SongID: 1,
      },
      {
        id: 2,
        PlaylistID: playlistID,
        SongID: 2,
      },
    ];

    playlistSongModel.findAll.mockResolvedValue(mockPlaylistSongs);

    const playlistSongs = await getPlaylistSongByPlaylist(playlistID);

    expect(playlistSongModel.findAll).toHaveBeenCalledWith({
      where: {
        PlaylistID: playlistID,
      },
    });

    expect(playlistSongs).toEqual(mockPlaylistSongs);
  });

  it('should throw an error if there is an error getting the playlist songs', async () => {
    const playlistID = 1;

    const mockError = new Error('Failed to get playlist songs');
    playlistSongModel.findAll.mockRejectedValue(mockError);

    await expect(getPlaylistSongByPlaylist(playlistID)).rejects.toThrowError('Failed to get playlist songs');
  });
});

describe('deletePlaylistSong', () => {
  it('should delete a playlist song with the given playlistID and songID', async () => {
    const playlistID = 1;
    const songID = 1;

    playlistSongModel.destroy.mockResolvedValue(1);

    const deletedPlaylistSong = await deletePlaylistSong(playlistID, songID);

    expect(playlistSongModel.destroy).toHaveBeenCalledWith({
      where: {
        PlaylistID: playlistID,
        SongID: songID,
      },
    });

    expect(deletedPlaylistSong).toEqual(1);
  });

  it('should throw an error if there is an error deleting the playlist song', async () => {
    const playlistID = 1;
    const songID = 1;

    const mockError = new Error('Failed to delete playlist song');
    playlistSongModel.destroy.mockRejectedValue(mockError);

    await expect(deletePlaylistSong(playlistID, songID)).rejects.toThrowError('Failed to delete playlist song');
  });
});

describe('deletePlaylistSongByPlaylist', () => {
  it('should delete playlist songs with the given playlistID', async () => {
    const playlistID = 1;

    playlistSongModel.destroy.mockResolvedValue(1);

    const deletedPlaylistSongs = await deletePlaylistSongByPlaylist(playlistID);

    expect(playlistSongModel.destroy).toHaveBeenCalledWith({
      where: {
        PlaylistID: playlistID,
      },
    });

    expect(deletedPlaylistSongs).toEqual(1);
  });

  it('should throw an error if there is an error deleting the playlist songs', async () => {
    const playlistID = 1;

    const mockError = new Error('Failed to delete playlist songs');
    playlistSongModel.destroy.mockRejectedValue(mockError);

    await expect(deletePlaylistSongByPlaylist(playlistID)).rejects.toThrowError('Failed to delete playlist songs');
  });
});