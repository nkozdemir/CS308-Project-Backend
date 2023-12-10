/**
 * @fileoverview Recommendation routes for the backend server.
 * @module recommendationRoutes
 */

const express = require('express');
const router = express.Router();
const authenticateToken = require('../helpers/authToken');
const songRatingController = require('../controllers/songRatingController');
const { getRecommendedSongs } = require('../helpers/spotifyHelpers');

/**
 * Route to get recommended songs for a user.
 * @name POST /recommendations/get
 * @function
 * @memberof module:recommendationRoutes
 * @param {string} req.user.id - The ID of the authenticated user.
 * @param {number} req.body.numberOfResults - The number of recommended songs to retrieve (default: 10).
 * @returns {Object} The response object containing the recommended songs.
 * @throws {Error} If there is an error getting the recommendations.
 */
router.post('/get', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        // Get numberOfResults from request body, if not provided, default to 10
        const numberOfResults = req.body.numberOfResults || 10;

        // Get high rated songs by user
        const songData = await songRatingController.getHighRatedSongsByUser(userId);
        console.log("Initial songdata:", songData);

        // If there are less than 5 songs in songData, get mid rated songs by user as well
        if (songData.length < 5) {
            const midRatedSongs = await songRatingController.getMidRatedSongsByUser(userId);
            console.log(midRatedSongs);
            songData.push(...midRatedSongs);
        }

        // If there are less than 5 songs in songData, get low rated songs by user as well
        if (songData.length < 5) {
            const lowRatedSongs = await songRatingController.getLowRatedSongsByUser(userId);
            console.log(lowRatedSongs);
            songData.push(...lowRatedSongs);
        }
        console.log("Final songdata:", songData);

        // Still, if there are less than 5 songs in songData, return an error
        if (songData.length < 5) {
            res.status(404).json({
                status: 'error',
                code: '404',
                message: 'Not enough rated songs by user to get recommendations',
            });
        }
        else {
            // Get recommendations from Spotify
            const recommendations = await getRecommendedSongs(songData, numberOfResults);

            res.status(200).json({
                status: 'success',
                code: '200',
                message: `Successfully retrieved ${recommendations.length} recommendations`,
                data: recommendations,
            });
        }
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({
            status: 'error',
            code: '500',
            message: 'Internal server error',
        });
    }
});

module.exports = router;