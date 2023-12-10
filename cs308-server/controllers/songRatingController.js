const songRating = require('../models/songRating');
const { Op } = require('sequelize');

async function getRatingById(ratingID) {
    try {
        const rating = await songRating.findOne({
            where: {
                SongRatingID: ratingID,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error getting song rating by ratingid:', error);
        throw error;
    }
}

async function getRatingByUser(userID) {
    try {
        const rating = await songRating.findAll({
            where: {
                UserID: userID,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error getting song rating by userid:', error);
        throw error;
    }
}

async function getRatingBySong(songID) {
    try {
        const rating = await songRating.findAll({
            where: {
                SongID: songID,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error getting song rating by songid:', error);
        throw error;
    }
}

async function getRatingByUserSong(userID, songID) {
    try {
        const rating = await songRating.findOne({
            where: {
                UserID: userID,
                SongID: songID,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error getting song rating by usersong:', error);
        throw error;
    }
}

async function createRating(userID, songID, rating, date) {
    try {
        const newRating = await songRating.create({
            UserID: userID,
            SongID: songID,
            Rating: rating,
            Date: date,
        });
        return newRating;
    } catch (error) {
        console.error('Error creating song rating:', error);
        throw error;
    }
}

async function deleteRatingById(ratingID) {
    try {
        const rating = await songRating.destroy({
            where: {
                SongRatingID: ratingID,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error deleting song rating by ratingid:', error);
        throw error;
    }
}

async function deleteRatingByUser(userID) {
    try {
        const rating = await songRating.destroy({
            where: {
                UserID: userID,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error deleting song rating by userid:', error);
        throw error;
    }
}

async function deleteRatingBySong(songID) {
    try {
        const rating = await songRating.destroy({
            where: {
                SongID: songID,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error deleting song rating by songid:', error);
        throw error;
    }
}

async function deleteRatingByUserSong(userID, songID) {
    try {
        const rating = await songRating.destroy({
            where: {
                UserID: userID,
                SongID: songID,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error deleting song rating by usersong:', error);
        throw error;
    }
}

async function getLatestRatingByUserSong(userID, songID) {
    try {
        const rating = await songRating.findOne({
            where: {
                UserID: userID,
                SongID: songID,
            },
            order: [['Date', 'DESC']], // Order by Date in descending order
        });
        return rating;
    } catch (error) {
        console.error('Error getting latest song rating by usersong:', error);
       throw error;
    }
}

async function getHighRatedSongsByUser(userID) {
    try {
        const ratings = await songRating.findAll({
            where: {
                UserID: userID,
                rating: {
                    [Op.gte]: 4, // Change the rating threshold as per your requirement
                },
            },
        });

        const songIDs = ratings.map((rating) => rating.SongID);
        //console.log('high rated songIDs', songIDs);

        return songIDs;
    } catch (error) {
        console.error('Error getting high rated songs by user:', error);
        throw error;
    }
}

async function getLatestRatingsForUserSongs(userId) {
    try {
        // Find all distinct user-song pairs
        const userSongPairs = await songRating.findAll({
            attributes: ['SongID'],
            where: {
                UserID: userId,
            },
            group: ['SongID'],
        });

        // Get the latest rating for each user-song pair
        const latestRatings = await Promise.all(userSongPairs.map(async ({ SongID }) => {
            const rating = await getLatestRatingByUserSong(userId, SongID);
            return rating;
        }));

        return latestRatings;
    } catch (error) {
        console.error('Error getting latest ratings for user songs:', error);
        throw error;
    }
}

async function getTopRatedSongs(userId, count) {
    try {
        // Retrieve latest ratings for user songs
        const latestRatings = await getLatestRatingsForUserSongs(userId);

        // Sort the ratings in descending order based on the Rating value
        const sortedRatings = latestRatings.sort((a, b) => b.Rating - a.Rating);

        // Get the top X rated user songs
        const topRatedUserSongs = sortedRatings.slice(0, count);

        return topRatedUserSongs;
    } catch (error) {
        console.error('Error getting top-rated songs:', error);
      throw error;
    }
}

async function getMidRatedSongsByUser(userID) {
    try {
        const ratings = await songRating.findAll({
            where: {
                UserID: userID,
                rating: {
                    [Op.gte]: 2, // Change the rating threshold as per your requirement
                    [Op.lt]: 4,
                },
            },
        });

        const songIDs = ratings.map((rating) => rating.SongID);
        console.log('mid rated songIDs', songIDs);

        return songIDs;
    } catch (error) {
        console.error('Error getting mid ratings by user:', error);
        throw error;
    }
}

async function getRatingsByDateRange(userId, startDate, endDate) {
    try {
        const ratings = await songRating.findAll({
            where: {
                UserID: userId,
                Date: {
                    [Op.between]: [startDate, endDate],
                },
            },
        });
        return ratings;
    } catch (error) {
        console.error('Error getting song ratings by date range:', error);
        throw error;
    }
}

function groupRatingsByDay(songRatings) {
    const ratingsByDay = new Map();

    songRatings.forEach((rating) => {
        const date = new Date(rating.Date).toDateString(); // Extracting the date without time
        if (!ratingsByDay.has(date)) {
            ratingsByDay.set(date, []);
        }
        ratingsByDay.get(date).push(rating);
    });

    return ratingsByDay;
}

function calculateDailyAverageRatings(ratingsByDay) {
    const dailyAverageRatings = [];

    for (const [date, ratings] of ratingsByDay.entries()) {
        const totalRating = ratings.reduce((sum, rating) => sum + rating.Rating, 0);
        const averageRating = totalRating / ratings.length;

        dailyAverageRatings.push({
            date,
            averageRating,
        });
    }

    return dailyAverageRatings;
}

async function getLowRatedSongsByUser(userID) {
    try {
        const ratings = await songRating.findAll({
            where: {
                UserID: userID,
                rating: {
                    [Op.lt]: 2, // Change the rating threshold as per your requirement
                },
            },
        });

        const songIDs = ratings.map((rating) => rating.SongID);
        console.log('low rated songIDs', songIDs)

        return songIDs;
    } catch (error) {
        console.error('Error getting low rated songs by user:', error);
        throw error;
    }
}

module.exports = {
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
    getTopRatedSongs,
    getRatingsByDateRange,
    groupRatingsByDay,
    calculateDailyAverageRatings,
    getHighRatedSongsByUser,
    getMidRatedSongsByUser,
    getLowRatedSongsByUser,
};