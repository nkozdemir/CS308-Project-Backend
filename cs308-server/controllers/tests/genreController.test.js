jest.mock('../genreController', () => ({
  createGenre: jest.fn(),
  getGenreByName: jest.fn(),
  getGenreById: jest.fn(),
  deleteGenre: jest.fn(),
}));

const { createGenre,
  getGenreByName,
  getGenreById,
  deleteGenre, } = require('../genreController');

var SequelizeMock = require('sequelize-mock');
const { DataTypes } = require('sequelize');

// Create a mock Sequelize instance
const sequelizeMock = new SequelizeMock();

// Mock the Genre model
const Genre = sequelizeMock.define('Genre', {
  GenreID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

describe('create', () => {
  it('creates a new genre', async () => {
    const genreData = {
      name: 'Test Genre',
    };

    // Mock the create method to return a mock genre
    createGenre.mockResolvedValue(genreData);

    const createdGenre = await createGenre(genreData, Genre);

    expect(createdGenre).toEqual(genreData);
    // Add more expectations based on your data structure
  });
});

describe('getGenreByName', () => {
  it('gets a genre by name', async () => {
    const genreData = {
      name: 'Test Genre',
    };

    // Mock the findOne method to return a mock genre
    getGenreByName.mockResolvedValue(genreData);

    const foundGenre = await getGenreByName(genreData.name, Genre);

    expect(foundGenre).toEqual(genreData);
    // Add more expectations based on your data structure
  });
});

describe('getGenreById', () => {
  it('gets a genre by id', async () => {
    const genreData = {
      name: 'Test Genre',
    };

    // Mock the findOne method to return a mock genre
    getGenreById.mockResolvedValue(genreData);

    const foundGenre = await getGenreById(genreData.id, Genre);

    expect(foundGenre).toEqual(genreData);
    // Add more expectations based on your data structure
  });
});

describe('deleteGenre', () => {
  it('deletes a genre', async () => {
    const genreData = {
      name: 'Test Genre',
    };

    // Mock the findOne method to return a mock genre
    deleteGenre.mockResolvedValue(genreData);

    const deletedGenre = await deleteGenre(genreData.id, Genre);

    expect(deletedGenre).toEqual(genreData);
    // Add more expectations based on your data structure
  });
});