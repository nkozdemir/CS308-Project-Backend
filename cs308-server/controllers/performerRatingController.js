const performerRating = require('../models/performerRating');

async function getRatingById(ratingID) {
    try {
        const rating = await performerRating.findOne({
            where: {
                PerformerRatingID: ratingID,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error getting performer rating by id:', error);
        throw error;
    }
}

async function getRatingByUser(userID) {
    try {
        const rating = await performerRating.findAll({
            where: {
                UserID: userID,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error getting performer rating by userid:', error);
        throw error;
    }
}

async function getRatingByPerformer(performerId) {
    try {
        const rating = await performerRating.findAll({
            where: {
                PerformerID: performerId,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error getting performer rating by performerid:', error);
        throw error;
    }
}

async function getRatingByUserPerformer(userID, performerId) {
    try {
        const rating = await performerRating.findOne({
            where: {
                UserID: userID,
                PerformerID: performerId,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error getting performer rating by userperformer:', error);
        throw error;
    }
}

async function createRating(userID, performerId, rating, date) {
    try {
        const newRating = await performerRating.create({
            UserID: userID,
            PerformerID: performerId,
            Rating: rating,
            Date: date,
        });
        return newRating;
    } catch (error) {
        console.error('Error creating performer rating:', error);
        throw error;
    }
}

async function deleteRatingById(ratingID) {
    try {
        const rating = await performerRating.destroy({
            where: {
                PerformerRatingID: ratingID,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error deleting performer rating by ratingid:', error);
        throw error;
    }
}

async function deleteRatingByUser(userID) {
    try {
        const rating = await performerRating.destroy({
            where: {
                UserID: userID,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error deleting performer rating by userid:', error);
        throw error;
    }
}

async function deleteRatingByPerformer(performerId) {
    try {
        const rating = await performerRating.destroy({
            where: {
                PerformerID: performerId,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error deleting performer rating by performerid:', error);
        throw error;
    }
}

async function deleteRatingByUserPerformer(userID, performerId) {
    try {
        const rating = await performerRating.destroy({
            where: {
                UserID: userID,
                PerformerID: performerId,
            },
        });
        return rating;
    } catch (error) {
        console.error('Error deleting performer rating by userperformer:', error);
        throw error;
    }
}

module.exports = {
    getRatingById,
    getRatingByUser,
    getRatingByPerformer,
    getRatingByUserPerformer,
    createRating,
    deleteRatingById,
    deleteRatingByUser,
    deleteRatingByPerformer,
    deleteRatingByUserPerformer,
};