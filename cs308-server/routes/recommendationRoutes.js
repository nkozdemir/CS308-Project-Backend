/**
 * @fileoverview Recommendation routes for the backend server.
 * @module recommendationRoutes
 */
const express = require('express');
const router = express.Router();
const authenticateToken = require('../helpers/authToken');
const songRatingController = require('../controllers/songRatingController');
const userSongController = require('../controllers/userSongController');
const performerRatingController = require('../controllers/performerRatingController');
const { getRecommendedSongs, getRecommendedSongsByPerformer } = require('../helpers/spotifyHelpers');

/**
 * Route to get recommended songs for a user.
 * @name POST /recommendations/get
 * @function
 * @memberof module:recommendationRoutes
 * @param {string} req.user.id - The ID of the authenticated user.
 * @param {number} req.body.numberOfResults - The number of recommended songs to retrieve. 
 * @returns {Object} The response object containing the recommended songs.
 * @throws {Error} If there is an error getting the recommendations.
 */
router.post('/song/rating', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const numberOfResults = req.body.numberOfResults; 

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

router.post('/song/latest', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const numberOfSongs = req.body.numberOfSongs; 

        // Get latest songs by user
        const latestSongs = await userSongController.getLatestSongs(userId, numberOfSongs);
        const songData = latestSongs.map((song) => song.SongInfo.SongID);

        // Check if there are enough songs
        if (latestSongs.length < 5) {
            return res.status(404).json({
                status: 'error',
                code: '404',
                message: 'Not enough songs added by user to get recommendations',
            });
        }

        // Get recommendations from Spotify
        const recommendations = await getRecommendedSongs(songData, numberOfSongs);

        res.status(200).json({
            status: 'success',
            code: '200',
            message: `Successfully retrieved ${latestSongs.length} recommendations`,
            data: recommendations,
        });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({
            status: 'error',
            code: '500',
            message: 'Internal server error',
        });
    }
});

router.post('/performer/rating', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const numberOfSongs = req.body.numberOfSongs; 

        // Get high rated performers by user
        const performerData = await performerRatingController.getHighRatedPerformers(userId);
        console.log("Initial performerData:", performerData);

        // If there are less than 5 performers in performerData, get mid rated performers by user as well
        if (performerData.length < 5) {
            const midRatedPerformers = await performerRatingController.getMidRatedPerformers(userId);
            console.log(midRatedPerformers);
            performerData.push(...midRatedPerformers);
        }

        // If there are less than 5 performers in performerData, get low rated performers by user as well
        if (performerData.length < 5) {
            const lowRatedPerformers = await performerRatingController.getLowRatedPerformers(userId);
            console.log(lowRatedPerformers);
            performerData.push(...lowRatedPerformers);
        }
        console.log("Final performerData:", performerData);

        // Still, if there are less than 5 performers in performerData, return an error
        if (performerData.length < 5) {
            res.status(404).json({
                status: 'error',
                code: '404',
                message: 'Not enough rated performers by user to get recommendations',
            });
        }
        else {
            // Get recommendations from Spotify
            const recommendations = await getRecommendedSongsByPerformer(performerData, numberOfSongs);

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