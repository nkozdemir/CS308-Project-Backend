jest.mock('../performerController', () => ({
  getAllPerformers: jest.fn(),
  createPerformer: jest.fn(),
  getPerformerByName: jest.fn(),
  getPerformerBySpotifyID: jest.fn(),
  getPerformerById: jest.fn(),
  deletePerformerBySpotifyId: jest.fn(),
  deletePerformerByPerformerId: jest.fn(),
}));

var SequelizeMock = require('sequelize-mock');
const { DataTypes } = require('sequelize');

const { getAllPerformers,
  createPerformer,
  getPerformerByName,
  getPerformerBySpotifyID,
  getPerformerById,
  deletePerformerBySpotifyId,
  deletePerformerByPerformerId } = require('../performerController');

// Create a mock Sequelize instance
const sequelizeMock = new SequelizeMock();

// Mock the Perfomer model
const Performer = sequelizeMock.define('Performer', {
  PerformerID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  SpotifyID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Image: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

describe('createPerformer', () => {
  it('creates a new performer', async () => {
    const performerData = {
      name: 'Test Performer',
      genre: 'Test Genre',
    };

    // Mock the create method to return a mock performer
    createPerformer.mockResolvedValue(performerData);

    const createdPerformer = await createPerformer(performerData, Performer);

    expect(createdPerformer).toEqual(performerData);
    // Add more expectations based on your data structure
  });
});

describe('getPerformerByName', () => {
  it('returns a performer by name', async () => {
    const name = 'Test Performer';

    // Mock the findOne method to return a mock performer
    getPerformerByName.mockResolvedValue({ name });

    const foundPerformer = await getPerformerByName(name, Performer);

    expect(foundPerformer).toEqual({ name });
  });
});

describe('getPerformerByID', () => {
  it('returns a performer by ID', async () => {
    const performerId = 1;

    // Mock the findOne method to return a mock performer
    getPerformerById.mockResolvedValue({ performerId });

    const foundPerformer = await getPerformerById(performerId, Performer);

    expect(foundPerformer).toEqual({ performerId });
  });
});

describe('getAllPerformers', () => {
  it('returns all performers', async () => {
    const performers = [
      { name: 'Test Performer 1' },
      { name: 'Test Performer 2' },
    ];

    // Mock the findAll method to return a mock performer
    getAllPerformers.mockResolvedValue(performers);

    const foundPerformers = await getAllPerformers(Performer);

    expect(foundPerformers).toEqual(performers);
  });
});

describe('getPerformerBySpotifyID', () => {
  it('returns a performer by Spotify ID', async () => {
    const spotifyID = '123456789';

    // Mock the findOne method to return a mock performer
    getPerformerBySpotifyID.mockResolvedValue({ spotifyID });

    const foundPerformer = await getPerformerBySpotifyID(spotifyID, Performer);

    expect(foundPerformer).toEqual({ spotifyID });
  });
});

describe('deletePerformerBySpotifyID', () => {
  it('deletes a performer by Spotify ID', async () => {
    const spotifyID = '123456789';

    // Mock the destroy method to return a mock performer
    deletePerformerBySpotifyId.mockResolvedValue({ spotifyID });

    const deletedPerformer = await deletePerformerBySpotifyId(spotifyID, Performer);

    expect(deletedPerformer).toEqual({ spotifyID });
  });
});

describe('deletePerformerByPerformerID', () => {
  it('deletes a performer by ID', async () => {
    const performerID = 1;

    // Mock the destroy method to return a mock performer
    deletePerformerByPerformerId.mockResolvedValue({ performerID });

    const deletedPerformer = await deletePerformerByPerformerId(performerID, Performer);

    expect(deletedPerformer).toEqual({ performerID });
  });
});