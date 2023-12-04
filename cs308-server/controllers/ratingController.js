const ratingModel = require('../models/rating');

async function getRatingById(ratingID) {
    try {
        const rating = await ratingModel.findOne({
            where: {
                RatingID: ratingID,
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
        const rating = await ratingModel.findAll({
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
        const rating = await ratingModel.findAll({
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
        const rating = await ratingModel.findOne({
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
        const existingRating = await ratingModel.findOne({
            where: {
                UserID: userID,
                SongID: songID,
            }
        });
        if (existingRating) {
            console.log(`User ${userID} has already rated song ${songID}`);
            return existingRating;
        }

        const newRating = await ratingModel.create({
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
        const rating = await ratingModel.destroy({
            where: {
                RatingID: ratingID,
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
        const rating = await ratingModel.destroy({
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
        const rating = await ratingModel.destroy({
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
        const rating = await ratingModel.destroy({
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