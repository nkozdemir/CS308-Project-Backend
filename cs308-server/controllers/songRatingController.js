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
        console.log('high rated songIDs', songIDs);

        return songIDs;
    } catch (error) {
        console.error('Error getting high rated songs by user:', error);
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
    getHighRatedSongsByUser,
    getMidRatedSongsByUser,
    getLowRatedSongsByUser,
};