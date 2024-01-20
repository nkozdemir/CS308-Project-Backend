const { createPlaylist, getPlaylistById } = require('../playlistController');
const playlistModel = require('../../models/playlist');


jest.mock('../../models/playlist');
jest.useFakeTimers()
describe('createPlaylist', () => {
  it('should create a playlist with the given name and user ID', async () => {
    const playlistName = 'My Playlist';
    const userID = 123;

    const mockPlaylist = {
      id: 1,
      Name: playlistName,
      UserID: userID,
      DateAdded: new Date(),
      Image: null,
    };

    playlistModel.create.mockResolvedValue(mockPlaylist);

    const createdPlaylist = await createPlaylist(playlistName, userID);

    expect(playlistModel.create).toHaveBeenCalledWith({
      Name: playlistName,
      UserID: userID,
      DateAdded: expect.anything(),
      Image: null,
    });

    expect(createdPlaylist).toEqual(mockPlaylist);
  });

  it('should throw an error if there is an error creating the playlist', async () => {
    const playlistName = 'My Playlist';
    const userID = 123;

    const mockError = new Error('Failed to create playlist');
    playlistModel.create.mockRejectedValue(mockError);

    await expect(createPlaylist(playlistName, userID)).rejects.toThrowError(
      'Failed to create playlist'
    );
  });
});

//run other tests for other functions in playlistController.js
describe('getPlaylistById', () => {
  it('should get a playlist with the given ID', async () => {
    const playlistID = 1;

    const mockPlaylist = {
      id: 1,
      Name: 'My Playlist',
      UserID: 123,
      DateAdded: new Date(),
      Image: null,
    };

    playlistModel.findOne.mockResolvedValue(mockPlaylist);

    const foundPlaylist = await getPlaylistById(playlistID);

    expect(playlistModel.findOne).toHaveBeenCalledWith({
      where: {
        PlaylistID: playlistID,
      },
    });

    expect(foundPlaylist).toEqual(mockPlaylist);
  });

  it('should throw an error if there is an error getting the playlist', async () => {
    const playlistID = 1;

    const mockError = new Error('Failed to get playlist');
    playlistModel.findOne.mockRejectedValue(mockError);

    await expect(getPlaylistById(playlistID)).rejects.toThrowError(
      'Failed to get playlist'
    );
  });
});
