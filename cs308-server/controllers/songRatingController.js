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
        console.error('Error getting rating:', error);
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
        console.error('Error getting rating:', error);
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
        console.error('Error getting rating:', error);
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
        console.error('Error getting rating:', error);
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
        console.error('Error creating rating:', error);
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
        console.error('Error deleting rating:', error);
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
        console.error('Error deleting rating:', error);
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
        console.error('Error deleting rating:', error);
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
        console.error('Error deleting rating:', error);
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
};