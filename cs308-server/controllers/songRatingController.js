const songRating = require('../models/songRating');

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
};