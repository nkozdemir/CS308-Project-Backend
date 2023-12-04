const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const userController = require("../controllers/userController");
const songController = require("../controllers/songController");
const userSongController = require("../controllers/userSongController");
const authenticateToken = require("../helpers/authToken");

// Route to get rating by id
router.get("/getRating/Id", async (req, res) => {
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

    const rating = await ratingController.getRatingById(ratingId);
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
router.get("/getRating/User", async (req, res) => {
  try {
    const { userId } = req.body;
    // Check if user id is valid
    if (!userId) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "User id is invalid",
      });
    }

    // Check if user exists
    const user = await userController.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User does not exist",
      });
    }

    const rating = await ratingController.getRatingByUser(userId);
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
router.get("/getRating/Song", async (req, res) => {
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

    const rating = await ratingController.getRatingBySong(songId);
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
router.get("/getRating/UserSong", async (req, res) => {
  try {
    const { userId, songId } = req.body;
    // Check if user id is valid
    if (!userId) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "User id is invalid",
      });
    }

    // Check if user exists
    const user = await userController.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User does not exist",
      });
    }

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

    const rating = await ratingController.getRatingByUserSong(userId, songId);
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
router.post("/createRating", async (req, res) => {
  try {
    const { userId, songId, rating } = req.body;
    // Check if user id is valid
    if (!userId) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "User id is invalid",
      });
    }

    // Check if user exists
    const user = await userController.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User does not exist",
      });
    }

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

    // Check if rating is valid and between 1 and 5
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Rating is invalid, should be between 1 and 5",
      });
    }

    // Get current date and time in MySQL DATETIME format
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    console.log("Date: ", date);
    
    const newRating = await ratingController.createRating(
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
router.delete("/deleteRating", async (req, res) => {
  try {
    const { userId, songId } = req.body;
    // Check if user id is valid
    if (!userId) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "User id is invalid",
      });
    }

    // Check if user exists
    const user = await userController.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User does not exist",
      });
    }

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

    const rating = await ratingController.getRatingByUserSong(userId, songId);
    // Check if rating exists
    if (!rating) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Rating does not exist",
      });
    }

    await ratingController.deleteRatingByUserSong(userId, songId);

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