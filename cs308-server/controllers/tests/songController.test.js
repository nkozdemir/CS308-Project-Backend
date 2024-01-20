jest.mock('../songController', () => ({
    createSong: jest.fn(),
    getSongByTitle: jest.fn(),
    getSongByID: jest.fn(),
    getSongBySpotifyID: jest.fn(),
    getSongByAlbum: jest.fn(),
    getSongByTitleAndAlbum: jest.fn(),
    deleteSong: jest.fn(),
    getSongsByUserIds: jest.fn(),
    getSongsBySongIds: jest.fn(),
    getUserSongsByDecade: jest.fn(),
    getUserSongsByMonth: jest.fn(),
  }));

var SequelizeMock = require('sequelize-mock');
const { DataTypes } = require('sequelize');
const { createSong, 
        getSongByTitle,
        getSongByID,
        getSongBySpotifyID,
        getSongByAlbum,
        getSongByTitleAndAlbum,
        deleteSong,
        getSongsByUserIds,
        getSongsBySongIds,
        getUserSongsByDecade,
        getUserSongsByMonth    } = require('../songController');

// Create a mock Sequelize instance
const sequelizeMock = new SequelizeMock();

// Mock the SongPerformer model
const SongPerformer = sequelizeMock.define('SongPerformer', {
  SongPerformerID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SongID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  PerformerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Mock the SongRating model
const SongRating = sequelizeMock.define('SongRating', {
  SongRatingID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  SongID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// Mock the Song model
const Song = sequelizeMock.define('Song', {
  SongID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ReleaseDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Album: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Length: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  SpotifyID: {
    type: DataTypes.STRING,
  },
  Image: {
    type: DataTypes.JSON,
  },
});

// Set up associations
Song.hasMany(SongRating, { foreignKey: 'SongID', as: 'SongRatingInfo' });
SongRating.belongsTo(Song, { foreignKey: 'SongID', as: 'SongInfo' });
SongPerformer.belongsTo(Song, { foreignKey: 'SongID', as: 'SongInfo' });

describe('create', () => {
    it('creates a new song', async () => {
    const songData = {
        Title: 'Test Song',
        ReleaseDate: '2022-01-01',
        Album: 'Test Album',
        Length: 180,
        SpotifyID: '123456789',
        Image: { url: 'test_image_url' },
    };

    // Mock the create method to return a mock song
    createSong.mockResolvedValue(songData); // Use Jest mocks for consistency

    const createdSong = await createSong(songData, Song);

    expect(createdSong).toEqual(songData);
    // Add more expectations based on your data structure
    });
});

describe('getSongByTitle', () => {
    it('returns a song by title', async () => {
    const title = 'Test Song';

    // Mock the findOne method to return a mock song
    getSongByTitle.mockResolvedValue({ Title: title }); // Use Jest mocks for consistency

    const foundSong = await getSongByTitle(title, Song);

    expect(foundSong).toEqual({ Title: title });
    });
});

describe('getSongByID', () => {
    it('returns a song by ID', async () => {
    const songId = 1;

    // Mock the findOne method to return a mock song
    getSongByID.mockResolvedValue({ SongID: songId }); // Use Jest mocks for consistency

    const foundSong = await getSongByID(songId, Song);

    expect(foundSong).toEqual({ SongID: songId });
    });
});

describe('getSongBySpotifyID', () => {
    it('returns a song by Spotify ID', async () => {
    const spotifyID = '123456789';

    // Mock the findOne method to return a mock song
    getSongBySpotifyID.mockResolvedValue({ SpotifyID: spotifyID }); // Use Jest mocks for consistency

    const foundSong = await getSongBySpotifyID(spotifyID, Song);

    expect(foundSong).toEqual({ SpotifyID: spotifyID });
    });
});

describe('getSongByAlbum', () => {
    it('returns a song by album', async () => {
    const album = 'Test Album';

    // Mock the findOne method to return a mock song
    getSongByAlbum.mockResolvedValue({ Album: album }); // Use Jest mocks for consistency

    const foundSong = await getSongByAlbum(album, Song);

    expect(foundSong).toEqual({ Album: album });
    });
});

describe('getSongByTitleAndAlbum', () => {
    it('returns a song by title and album', async () => {
    const title = 'Test Song';
    const album = 'Test Album';

    // Mock the findOne method to return a mock song
    getSongByTitleAndAlbum.mockResolvedValue({ Title: title, Album: album }); // Use Jest mocks for consistency

    const foundSong = await getSongByTitleAndAlbum(title, album, Song);

    expect(foundSong).toEqual({ Title: title, Album: album });
    });
});

describe('deleteSong', () => {
    it('deletes a song', async () => {
    const songId = 1;

    // Mock the destroy method to return a mock song
    deleteSong.mockResolvedValue({ SongID: songId }); // Use Jest mocks for consistency

    const deletedSong = await deleteSong(songId, Song);

    expect(deletedSong).toEqual({ SongID: songId });
    });
});

describe('getSongsByUserIds', () => {
    it('returns songs by user IDs', async () => {
    const userIds = [1, 2, 3];

    // Mock the findAll method to return mock songs
    getSongsByUserIds.mockResolvedValue([{ UserID: userIds[0] }, { UserID: userIds[1] }, { UserID: userIds[2] }]); // Use Jest mocks for consistency

    const foundSongs = await getSongsByUserIds(userIds, Song);

    expect(foundSongs).toEqual([{ UserID: userIds[0] }, { UserID: userIds[1] }, { UserID: userIds[2] }]);
    });
});

describe('getSongsBySongIds', () => {
    it('returns songs by song IDs', async () => {
    const songIds = [1, 2, 3];

    // Mock the findAll method to return mock songs
    getSongsBySongIds.mockResolvedValue([{ SongID: songIds[0] }, { SongID: songIds[1] }, { SongID: songIds[2] }]); // Use Jest mocks for consistency

    const foundSongs = await getSongsBySongIds(songIds, Song);

    expect(foundSongs).toEqual([{ SongID: songIds[0] }, { SongID: songIds[1] }, { SongID: songIds[2] }]);
    });
});

describe('getUserSongsByDecade', () => {
    it('returns user songs by decade', async () => {
    const userId = 1;
    const decade = 2020;

    // Mock the findAll method to return mock songs
    getUserSongsByDecade.mockResolvedValue([{ UserID: userId, ReleaseDate: decade }]); // Use Jest mocks for consistency

    const foundSongs = await getUserSongsByDecade(userId, decade, Song);

    expect(foundSongs).toEqual([{ UserID: userId, ReleaseDate: decade }]);
    });
});

describe('getUserSongsByMonth', () => {
    it('returns user songs by month', async () => {
    const userId = 1;
    const month = 1;

    // Mock the findAll method to return mock songs
    getUserSongsByMonth.mockResolvedValue([{ UserID: userId, ReleaseDate: month }]); // Use Jest mocks for consistency

    const foundSongs = await getUserSongsByMonth(userId, month, Song);

    expect(foundSongs).toEqual([{ UserID: userId, ReleaseDate: month }]);
    });
});
