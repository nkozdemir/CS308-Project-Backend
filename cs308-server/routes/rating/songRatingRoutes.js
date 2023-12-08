const express = require("express");
const router = express.Router();

const songRatingController = require("../../controllers/songRatingController");
const songController = require("../../controllers/songController");
const userSongController = require("../../controllers/userSongController");
const authenticateToken = require("../../helpers/authToken");
const { getCurrentDateTime } = require("../../helpers/dateHelper");

// Route to get rating by id
router.post("/get/ratingid", authenticateToken, async (req, res) => {
  try {
    const { ratingId } = req.body;
    // Check if rating id is valid
    if (!ratingId) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Rating id is invalid",
      });
    }

    const rating = await songRatingController.getRatingById(ratingId);
    // Check if rating exists
    if (!rating) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Rating does not exist",
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Rating retrieved by id",
      data: rating,
    });
  } catch (err) {
    console.error("Error getting rating by id: ", err);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
    });
  }
});

// Route to get rating by user
router.get("/get/userid", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; 

    const rating = await songRatingController.getRatingByUser(userId);
    // Check if rating exists
    if (!rating) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Rating does not exist",
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Rating retrieved by user",
      data: rating,
    });
  } catch (err) {
    console.error("Error getting rating by user: ", err);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
    });
  }
});

// Route to get rating by song
router.post("/get/songid", authenticateToken, async (req, res) => {
  try {
    const { songId } = req.body;
    // Check if song id is valid
    if (!songId) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Song id is invalid",
      });
    }

    // Check if song exists
    const song = await songController.getSongByID(songId);
    if (!song) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Song does not exist",
      });
    }

    const rating = await songRatingController.getRatingBySong(songId);
    // Check if rating exists
    if (!rating) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Rating does not exist",
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Rating retrieved by song",
      data: rating,
    });
  } catch (err) {
    console.error("Error getting rating by song: ", err);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
    });
  }
});

// Route to get rating by user and song
router.post("/get/usersong", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.body;

    // Check if song id is valid
    if (!songId) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Song id is invalid",
      });
    }

    // Check if song exists
    const song = await songController.getSongByID(songId);
    if (!song) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Song does not exist",
      });
    }

    // Check if user and song exists in UserSong table
    const userSong = await userSongController.getUserSongLink(
        userId,
        songId
    );
    if (!userSong) {
        return res.status(404).json({
            status: "error",
            code: 404,
            message: "User and song does not exist in UserSong table",
        });
    }

    const rating = await songRatingController.getRatingByUserSong(userId, songId);
    // Check if rating exists
    if (!rating) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Rating does not exist",
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Rating retrieved by user and song",
      data: rating,
    });
  } catch (err) {
    console.error("Error getting rating by user and song: ", err);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
    });
  }
});

// Route to create rating
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId, rating } = req.body;

    // Check if song id is valid
    if (!songId) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Song id is invalid",
      });
    }

    // Check if song exists
    const song = await songController.getSongByID(songId);
    if (!song) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Song does not exist",
      });
    }

    // Check if user and song exists in UserSong table
    const userSong = await userSongController.getUserSongLink(
      userId,
      songId
    );
    if (!userSong) {
        return res.status(404).json({
            status: "error",
            code: 404,
            message: "User and song does not exist in UserSong table",
        });
    }

    // Check if rating is valid and between 0 and 5
    if (!rating || rating < 0 || rating > 5) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Rating is invalid, it must be between 0 and 5",
      });
    }

    // Get current date and time in MySQL DATETIME format
    const date = getCurrentDateTime();
    
    const newRating = await songRatingController.createRating(
      userId,
      songId,
      rating,
      date
    );

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Rating created",
      data: newRating,
    });
  } catch (err) {
    console.error("Error creating rating: ", err);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
    });
  }
});

// Route to remove rating
router.post("/delete", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.body;

    // Check if song id is valid
    if (!songId) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Song id is invalid",
      });
    }

    // Check if song exists
    const song = await songController.getSongByID(songId);
    if (!song) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Song does not exist",
      });
    }

    // Check if user and song exists in UserSong table
    const userSong = await userSongController.getUserSongLink(
      userId,
      songId
    );
    if (!userSong) {
        return res.status(404).json({
            status: "error",
            code: 404,
            message: "User and song does not exist in UserSong table",
        });
    }

    const rating = await songRatingController.getRatingByUserSong(userId, songId);
    // Check if rating exists
    if (!rating) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Rating does not exist",
      });
    }

    await songRatingController.deleteRatingByUserSong(userId, songId);

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Rating removed",
    });
  } catch (err) {
    console.error("Error removing rating: ", err);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
    });
  }
});

module.exports = router;