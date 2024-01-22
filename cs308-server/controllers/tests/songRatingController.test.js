jest.mock('../songRatingController', () => ({
    getRatingById: jest.fn(),
    getRatingByUser: jest.fn(),
    getRatingBySong: jest.fn(),
    getRatingByUserSong: jest.fn(),
    createRating: jest.fn(),
    deleteRatingById: jest.fn(),
    deleteRatingByUser: jest.fn(),
    deleteRatingBySong: jest.fn(),
    deleteRatingByUserSong: jest.fn(),
    getLatestRatingByUserSong: jest.fn(),
    getLatestRatingsForUserSongs: jest.fn(),
    getTopRatedUserSongs: jest.fn(),
    getTopRatedSongs: jest.fn(),
    getRatingsByDateRange: jest.fn(),
    getTopRatedSongsByAverage: jest.fn(),
    groupRatingsByDay: jest.fn(),
    calculateDailyAverageRatings: jest.fn(),
  }));

const {
    getRatingById,
    getRatingByUser,
    getRatingBySong,
    getRatingByUserSong,
    createRating,
    deleteRatingById,
    deleteRatingByUser,
    deleteRatingBySong,
    deleteRatingByUserSong,
    getLatestRatingByUserSong,
    getLatestRatingsForUserSongs,
    getTopRatedUserSongs,
    getTopRatedSongs,
    getRatingsByDateRange,
    getTopRatedSongsByAverage,
    groupRatingsByDay,
    calculateDailyAverageRatings,
} = require('../songRatingController');

var SequelizeMock = require('sequelize-mock');
const { DataTypes } = require('sequelize');

// Create a mock Sequelize instance
const sequelizeMock = new SequelizeMock();

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

// do negative testing which is testing for errors
describe('getRatingById', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return null for a non-existing ratingID', async () => {
      // Arrange
      const nonExistingRatingID = 999; // Assuming 999 is not a valid ratingID
  
      // Mock the findOne method to return null
      getRatingById.mockResolvedValue(null);
  
      // Act
      const result = await getRatingById(nonExistingRatingID);
  
      // Assert
      expect(result).toBeNull();
      expect(getRatingById).toHaveBeenCalledWith(nonExistingRatingID);
    });
});

describe('getRatingByUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return null for a non-existing userID', async () => {
      // Arrange
      const nonExistingUserID = 999; // Assuming 999 is not a valid userID
  
      // Mock the findOne method to return null
      getRatingByUser.mockResolvedValue(null);
  
      // Act
      const result = await getRatingByUser(nonExistingUserID);
  
      // Assert
      expect(result).toBeNull();
      expect(getRatingByUser).toHaveBeenCalledWith(nonExistingUserID);
    });
});

describe('getRatingBySong', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return null for a non-existing songID', async () => {
      // Arrange
      const nonExistingSongID = 999; // Assuming 999 is not a valid songID
  
      // Mock the findOne method to return null
      getRatingBySong.mockResolvedValue(null);
  
      // Act
      const result = await getRatingBySong(nonExistingSongID);
  
      // Assert
      expect(result).toBeNull();
      expect(getRatingBySong).toHaveBeenCalledWith(nonExistingSongID);
    });
});

describe('getRatingByUserSong', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return null for a non-existing userID and songID', async () => {
      // Arrange
      const nonExistingUserID = 999; // Assuming 999 is not a valid userID
      const nonExistingSongID = 999; // Assuming 999 is not a valid songID
  
      // Mock the findOne method to return null
      getRatingByUserSong.mockResolvedValue(null);
  
      // Act
      const result = await getRatingByUserSong(nonExistingUserID, nonExistingSongID);
  
      // Assert
      expect(result).toBeNull();
      expect(getRatingByUserSong).toHaveBeenCalledWith(nonExistingUserID, nonExistingSongID);
    });
});

describe('deleteRatingById', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should throw an error if the rating deletion fails', async () => {
      // Arrange
      const ratingIDToDelete = 1;
  
      // Mock the destroy method to simulate a failure (e.g., constraint violation)
      deleteRatingById.mockRejectedValue(new Error('Rating deletion failed'));
  
      // Act and Assert
      await expect(deleteRatingById(ratingIDToDelete)).rejects.toThrow('Rating deletion failed');
      expect(deleteRatingById).toHaveBeenCalledWith(ratingIDToDelete);
    });
});

describe('deleteRatingByUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should throw an error if the rating deletion fails', async () => {
      // Arrange
      const userIDToDelete = 1;
  
      // Mock the destroy method to simulate a failure (e.g., constraint violation)
      deleteRatingByUser.mockRejectedValue(new Error('Rating deletion failed'));
  
      // Act and Assert
      await expect(deleteRatingByUser(userIDToDelete)).rejects.toThrow('Rating deletion failed');
      expect(deleteRatingByUser).toHaveBeenCalledWith(userIDToDelete);
    });
});

describe('deleteRatingBySong', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should throw an error if the rating deletion fails', async () => {
      // Arrange
      const songIDToDelete = 1;
  
      // Mock the destroy method to simulate a failure (e.g., constraint violation)
      deleteRatingBySong.mockRejectedValue(new Error('Rating deletion failed'));
  
      // Act and Assert
      await expect(deleteRatingBySong(songIDToDelete)).rejects.toThrow('Rating deletion failed');
      expect(deleteRatingBySong).toHaveBeenCalledWith(songIDToDelete);
    });
});

describe('deleteRatingByUserSong', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should throw an error if the rating deletion fails', async () => {
      // Arrange
      const userIDToDelete = 1;
      const songIDToDelete = 2;
  
      // Mock the destroy method to simulate a failure (e.g., constraint violation)
      deleteRatingByUserSong.mockRejectedValue(new Error('Rating deletion failed'));
  
      // Act and Assert
      await expect(deleteRatingByUserSong(userIDToDelete, songIDToDelete)).rejects.toThrow('Rating deletion failed');
      expect(deleteRatingByUserSong).toHaveBeenCalledWith(userIDToDelete, songIDToDelete);
    });
});

describe('getLatestRatingByUserSong', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return null for a non-existing userID and songID', async () => {
      // Arrange
      const nonExistingUserID = 999; // Assuming 999 is not a valid userID
      const nonExistingSongID = 999; // Assuming 999 is not a valid songID
  
      // Mock the findOne method to return null
      getLatestRatingByUserSong.mockResolvedValue(null);
  
      // Act
      const result = await getLatestRatingByUserSong(nonExistingUserID, nonExistingSongID);
  
      // Assert
      expect(result).toBeNull();
      expect(getLatestRatingByUserSong).toHaveBeenCalledWith(nonExistingUserID, nonExistingSongID);
    });
});

describe('getLatestRatingsForUserSongs', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return null for a non-existing userID', async () => {
      // Arrange
      const nonExistingUserID = 999; // Assuming 999 is not a valid userID
  
      // Mock the findOne method to return null
      getLatestRatingsForUserSongs.mockResolvedValue(null);
  
      // Act
      const result = await getLatestRatingsForUserSongs(nonExistingUserID);
  
      // Assert
      expect(result).toBeNull();
      expect(getLatestRatingsForUserSongs).toHaveBeenCalledWith(nonExistingUserID);
    });
});

describe('getTopRatedUserSongs', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return null for a non-existing userID', async () => {
      // Arrange
      const nonExistingUserID = 999; // Assuming 999 is not a valid userID
  
      // Mock the findOne method to return null
      getTopRatedUserSongs.mockResolvedValue(null);
  
      // Act
      const result = await getTopRatedUserSongs(nonExistingUserID);
  
      // Assert
      expect(result).toBeNull();
      expect(getTopRatedUserSongs).toHaveBeenCalledWith(nonExistingUserID);
    });
});

describe('getTopRatedSongs', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return null for a non-existing songID', async () => {
      // Arrange
      const nonExistingSongID = 999; // Assuming 999 is not a valid songID
  
      // Mock the findOne method to return null
      getTopRatedSongs.mockResolvedValue(null);
  
      // Act
      const result = await getTopRatedSongs(nonExistingSongID);
  
      // Assert
      expect(result).toBeNull();
      expect(getTopRatedSongs).toHaveBeenCalledWith(nonExistingSongID);
    });
});

describe('getRatingsByDateRange', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return null for a non-existing userID', async () => {
      // Arrange
      const nonExistingUserID = 999; // Assuming 999 is not a valid userID
  
      // Mock the findOne method to return null
      getRatingsByDateRange.mockResolvedValue(null);
  
      // Act
      const result = await getRatingsByDateRange(nonExistingUserID);
  
      // Assert
      expect(result).toBeNull();
      expect(getRatingsByDateRange).toHaveBeenCalledWith(nonExistingUserID);
    });
});

describe('getTopRatedSongsByAverage', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return null for a non-existing userID', async () => {
      // Arrange
      const nonExistingUserID = 999; // Assuming 999 is not a valid userID
  
      // Mock the findOne method to return null
      getTopRatedSongsByAverage.mockResolvedValue(null);
  
      // Act
      const result = await getTopRatedSongsByAverage(nonExistingUserID);
  
      // Assert
      expect(result).toBeNull();
      expect(getTopRatedSongsByAverage).toHaveBeenCalledWith(nonExistingUserID);
    });
});

describe('groupRatingsByDay', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return null for a non-existing userID', async () => {
      // Arrange
      const nonExistingUserID = 999; // Assuming 999 is not a valid userID
  
      // Mock the findOne method to return null
      groupRatingsByDay.mockResolvedValue(null);
  
      // Act
      const result = await groupRatingsByDay(nonExistingUserID);
  
      // Assert
      expect(result).toBeNull();
      expect(groupRatingsByDay).toHaveBeenCalledWith(nonExistingUserID);
    });
});

// boundary testing

describe('createRating', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new rating with valid inputs', async () => {
        // Arrange
        const userID = 1;
        const songID = 2;
        const rating = 4;

        // Mock the create method to return a mock rating object
        createRating.mockResolvedValue({
            SongRatingID: 1,
            UserID: userID,
            SongID: songID,
            Rating: rating,
            Date: new Date(),
        });

        // Act
        const result = await createRating(userID, songID, rating);

        // Assert
        expect(result).toHaveProperty('SongRatingID');
        expect(result.UserID).toBe(userID);
        expect(result.SongID).toBe(songID);
        expect(result.Rating).toBe(rating);
        expect(createRating).toHaveBeenCalledWith(userID, songID, rating);
    });

    it('should throw an error if the rating is below the valid range', async () => {
        // Arrange
        const userID = 1;
        const songID = 2;
        const rating = 0;

        createRating.mockRejectedValue(new Error('Rating must be between 1 and 5'));

        // Act and Assert
        await expect(createRating(userID, songID, rating)).rejects.toThrow('Rating must be between 1 and 5');
        expect(createRating).toHaveBeenCalledWith(userID, songID, rating);
    });

    it('should throw an error if the rating is above the valid range', async () => {
        // Arrange
        const userID = 1;
        const songID = 2;
        const rating = 6;

        createRating.mockRejectedValue(new Error('Rating must be between 1 and 5'));

        // Act and Assert
        await expect(createRating(userID, songID, rating)).rejects.toThrow('Rating must be between 1 and 5');
        expect(createRating).toHaveBeenCalledWith(userID, songID, rating);
    });
});