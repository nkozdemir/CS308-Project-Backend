const performerRating = require('../models/performerRating');
const PerformerModel = require('../models/performer');
const { Sequelize, Op } = require('sequelize');

async function getRatingById(ratingID) {
    try {
        const rating = await performerRating.findOne({
            where: {
                PerformerRatingID: ratingID,
            },
            include: [
                {
                    model: PerformerModel,
                    as: 'PerformerInfo',
                },
            ],
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
            include: {
                model: PerformerModel,
                as: 'PerformerInfo',
                required: true,
                nest: true,
            }
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
            include: [
                {
                    model: PerformerModel,
                    as: 'PerformerInfo',
                },
            ],
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
            include: [
                {
                    model: PerformerModel,
                    as: 'PerformerInfo',
                },
            ],
        });
        return rating;
    } catch (error) {
        console.error('Error getting performer rating by userperformer:', error);
        throw error;
    }
}

async function createRating(userID, performerId, rating) {
    try {
        const newRating = await performerRating.create({
            UserID: userID,
            PerformerID: performerId,
            Rating: rating,
            Date: Sequelize.fn('NOW'),
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

async function getTopRatedPerformers(userId, count = 5) {
    try {
        const topPerformers = await performerRating.findAll({
            attributes: [
                'PerformerInfo.PerformerID',
                [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating'],
            ],
            where: {
                UserID: userId,
            },
            include: [
                {
                    model: PerformerModel,
                    as: 'PerformerInfo',
                },
            ],
            group: ['PerformerInfo.PerformerID'],
            order: [[Sequelize.literal('averageRating'), 'DESC']],
            limit: count,
        });

        return topPerformers.map((rating) => ({
            PerformerInfo: rating.PerformerInfo,
            averageRating: parseFloat(rating.dataValues.averageRating).toFixed(2),
        }));
    } catch (error) {
        console.error('Error getting top rated performers:', error);
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
    getTopRatedPerformers,
};