const songModel = require('../models/song');
const songRating = require('../models/songRating');
const { Sequelize, Op } = require('sequelize');

async function getRatingById(ratingID) {
    try {
        const rating = await songRating.findOne({
            where: {
                SongRatingID: ratingID,
            },
            include: [
                {
                    model: songModel,
                    as: 'SongInfo',
                },
            ],
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
            include: [
                {
                    model: songModel,
                    as: 'SongInfo',
                },
            ],
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
            include: [
                {
                    model: songModel,
                    as: 'SongInfo',
                },
            ],
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
            include: [
                {
                    model: songModel,
                    as: 'SongInfo',
                },
            ],
        });
        return rating;
    } catch (error) {
        console.error('Error getting song rating by usersong:', error);
        throw error;
    }
}

async function createRating(userID, songID, rating) {
    try {
        const newRating = await songRating.create({
            UserID: userID,
            SongID: songID,
            Rating: rating,
            Date: Sequelize.fn('NOW'),
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
            include: [
                {
                    model: songModel,
                    as: 'SongInfo',
                },
            ],
            order: [['Date', 'DESC']], // Order by Date in descending order
        });
        return rating;
    } catch (error) {
        console.error('Error getting latest song rating by usersong:', error);
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
            include: [
                {
                    model: songModel,
                    as: 'SongInfo',
                },
            ],
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

async function getTopRatedUserSongs(userId, count) {
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

async function getTopRatedSongs(songData, count) {
    try {
        // Sort the ratings in descending order based on the Rating value
        const sortedRatings = songData.sort((a, b) => b.SongRatingInfo.Rating - a.SongRatingInfo.Rating);

        // Get the top X rated user songs
        const topRatedSongs = sortedRatings.slice(0, count);

        return topRatedSongs;
    } catch (error) {
        console.error('Error getting top-rated songs:', error);
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
            include: [
                {
                    model: songModel,
                    as: 'SongInfo',
                },
            ],
        });
        return ratings;
    } catch (error) {
        console.error('Error getting song ratings by date range:', error);
        throw error;
    }
}

async function getTopRatedSongsByAverage(userId, count = 5) {
    try {
        const topSongs = await songRating.findAll({
            attributes: [
                'SongInfo.SongID',
                [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating'],
            ],
            where: {
                UserID: userId,
            },
            include: [
                {
                    model: songModel,
                    as: 'SongInfo',
                },
            ],
            group: ['SongInfo.SongID'],
            order: [[Sequelize.literal('averageRating'), 'DESC']],
            limit: count,
        });

        return topSongs.map((rating) => ({
            SongInfo: rating.SongInfo,
            averageRating: parseFloat(rating.dataValues.averageRating).toFixed(2),
        }));
    } catch (error) {
        console.error('Error getting top-rated songs:', error);
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
    getTopRatedUserSongs,
    getTopRatedSongs,
    getTopRatedSongsByAverage,
    getRatingsByDateRange,
    groupRatingsByDay,
    calculateDailyAverageRatings,
};