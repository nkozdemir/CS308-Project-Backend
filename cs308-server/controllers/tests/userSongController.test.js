const userSongController = require('../userSongController');
const userSongModel = require('../../models/usersong');

jest.mock('../../models/usersong', () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock('../../models/song', () => ({}));

describe('getUserSongLink', () => {
  test('should get user-song link by userID and songID', async () => {
    const userID = 1;
    const songID = 1;
    const userSongLink = { UserID: userID, SongID: songID };

    userSongModel.findOne.mockResolvedValue(userSongLink);

    const result = await userSongController.getUserSongLink(userID, songID);

    expect(result).toEqual(userSongLink);
    expect(userSongModel.findOne).toHaveBeenCalledWith({
      where: {
        UserID: userID,
        SongID: songID,
      },
    });
  });
});

describe('getLinkByUser', () => {
  test('should get user-song links by userID', async () => {
    const userID = 1;
    const userSongLinks = [{ UserID: userID, SongID: 1 }, { UserID: userID, SongID: 2 }];

    userSongModel.findAll.mockResolvedValue(userSongLinks);

    const result = await userSongController.getLinkByUser(userID);

    expect(result).toEqual(userSongLinks);
    expect(userSongModel.findAll).toHaveBeenCalledWith({
      where: {
        UserID: userID,
      },
    });
  });
});

// Add more test cases for other functions in userSongController