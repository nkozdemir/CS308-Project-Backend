const express = require('express');
const router = express.Router();
const authenticateToken = require('../helpers/authToken');
const songRatingController = require('../controllers/songRatingController');
const userSongController = require('../controllers/userSongController');
const performerRatingController = require('../controllers/performerRatingController');
const friendController = require('../controllers/friendController'); 
const { getRecommendedSongs, getRecommendedSongsByPerformer } = require('../helpers/spotifyHelpers');

// Get recommendations based on user's high rated songs (by average)
router.post('/song/rating', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const numberOfResults = req.body.numberOfResults; 

        // Get high rated songs by user
        let songData = await songRatingController.getTopRatedSongsByAverage(userId);
        songData = songData.map((song) => song.SongInfo);
        //console.log("Initial songdata:", songData);

        if (songData.length === 0) {
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

// Get recommendations based on user's latest added songs
router.post('/song/latest', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const numberOfSongs = req.body.numberOfSongs; 

        // Get latest songs by user
        let songData = await userSongController.getLatestSongs(userId, numberOfSongs);
        songData = songData.map((song) => song.SongInfo);

        // Check if there are enough songs
        if (songData.length === 0) {
            res.status(404).json({
                status: 'error',
                code: '404',
                message: 'Not enough songs added by user to get recommendations',
            });
        } else {
            // Get recommendations from Spotify
            const recommendations = await getRecommendedSongs(songData, numberOfSongs);

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

// Get recommendations based on user's high rated performers (by average)
router.post('/performer/rating', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const numberOfSongs = req.body.numberOfSongs; 

        // Get high rated performers by user
        let performerData = await performerRatingController.getTopRatedPerformers(userId);
        performerData = performerData.map((performer) => performer.PerformerInfo.SpotifyID);
        //console.log("Initial performerData:", performerData);

        if (performerData.length === 0) {
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

// Get recommendations based on user's friends' high rated songs (by average)
router.post('/friend/rating', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const numberOfSongs = req.body.numberOfSongs; 

        // Get users' friends
        const friends = await friendController.getFriendByUserId(userId);
        //console.log("Friends:", friends);

        // Check if user has friends
        if (friends.length === 0) {
            return res.status(404).json({
                status: 'error',
                code: '404',
                message: 'User has no friends',
            });
        }

        // Get high rated songs by user's friends
        let songData = [];
        for (let i = 0; i < friends.length; i++) {
            const friendId = friends[i].FriendUserID;
            const friendSongs = await songRatingController.getTopRatedSongsByAverage(friendId);
            songData = songData.concat(friendSongs);
        }
        //console.log("SongData:", songData);

        if (songData.length === 0) {
            res.status(404).json({
                status: 'error',
                code: '404',
                message: 'Not enough rated songs by user\'s friends to get recommendations',
            });
        }
        else {
            // If there are more than 5 songs, choose 5 random songs. Ensure no duplicates
            if (songData.length > 5) {
                const randomSongData = [];
                while (randomSongData.length < 5) {
                    const randomIndex = Math.floor(Math.random() * songData.length);
                    if (!randomSongData.includes(songData[randomIndex])) {
                        randomSongData.push(songData[randomIndex]);
                    }
                }
                songData = randomSongData;
                //console.log("Random song data:", songData);
            }
            songData = songData.map((song) => song.SongInfo);

            // Get recommendations from Spotify
            const recommendations = await getRecommendedSongs(songData, numberOfSongs);

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

// Get recommendations based on user's friends' latest added songs
router.post('/friend/latest', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const numberOfSongs = req.body.numberOfSongs; 

        // Get users' friends
        const friends = await friendController.getFriendByUserId(userId);
        //console.log("Friends:", friends);

        // Check if user has friends
        if (friends.length === 0) {
            return res.status(404).json({
                status: 'error',
                code: '404',
                message: 'User has no friends',
            });
        }

        // Get latest songs by user's friends
        let songData = [];
        for (let i = 0; i < friends.length; i++) {
            const friendId = friends[i].FriendUserID;
            const friendSongs = await userSongController.getLatestSongs(friendId, numberOfSongs);
            songData = songData.concat(friendSongs);
        }
        //console.log("SongData:", songData);

        if (songData.length === 0) {
            res.status(404).json({
                status: 'error',
                code: '404',
                message: 'Not enough songs added by user\'s friends to get recommendations',
            });
        }
        else {
            // If there are more than 5 songs, choose 5 random songs. Ensure no duplicates
            if (songData.length > 5) {
                const randomSongData = [];
                while (randomSongData.length < 5) {
                    const randomIndex = Math.floor(Math.random() * songData.length);
                    if (!randomSongData.includes(songData[randomIndex])) {
                        randomSongData.push(songData[randomIndex]);
                    }
                }
                songData = randomSongData;
                //console.log("Random song data:", songData);
            }
            songData = songData.map((song) => song.SongInfo);

            // Get recommendations from Spotify
            const recommendations = await getRecommendedSongs(songData, numberOfSongs);

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