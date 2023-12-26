const express = require("express");
const router = express.Router();

const performerRatingController = require("../../controllers/performerRatingController");
const performerController = require("../../controllers/performerController");
const authenticateToken = require("../../helpers/authToken");

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

    const rating = await performerRatingController.getRatingById(ratingId);
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

// Route to get rating by user id
router.get("/get/userid", authenticateToken, async (req, res) => { 
    try {
        const user = req.user.id;
        const rating = await performerRatingController.getRatingByUser(user);
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
            message: "Rating retrieved by user id",
            data: rating,
        });
    } catch (err) {
        console.error("Error getting rating by user id: ", err);
        return res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal server error",
        });
    }
});

// Route to get rating by performer id
router.post("/get/performerid", authenticateToken, async (req, res) => { 
    try {
        const { performerId } = req.body;
        // Check if performer id is valid
        if (!performerId) {
            return res.status(400).json({
                status: "error",
                code: 400,
                message: "Performer id is invalid",
            });
        }
        // Check if performer exists
        const performer = await performerController.getPerformerById(performerId);
        if (!performer) {
            return res.status(404).json({
                status: "error",
                code: 404,
                message: "Performer does not exist",
            });
        }
        const rating = await performerRatingController.getRatingByPerformer(performerId);
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
            message: "Rating retrieved by performer id",
            data: rating,
        });
    } catch (err) {
        console.error("Error getting rating by performer id: ", err);
        return res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal server error",
        });
    }
});

// Route to get rating by user id and performer id
router.post("/get/userperformer", authenticateToken, async (req, res) => { 
    try {
        const user = req.user.id;
        const { performerId } = req.body;
        // Check if performer id is valid
        if (!performerId) {
            return res.status(400).json({
                status: "error",
                code: 400,
                message: "Performer id is invalid",
            });
        }
        // Check if performer exists
        const performer = await performerController.getPerformerById(performerId);
        if (!performer) {
            return res.status(404).json({
                status: "error",
                code: 404,
                message: "Performer does not exist",
            });
        }
        const rating = await performerRatingController.getRatingByUserPerformer(user, performerId);
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
            message: "Rating retrieved by user id and performer id",
            data: rating,
        });
    } catch (err) {
        console.error("Error getting rating by user id and performer id: ", err);
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
    const { performerId, rating } = req.body;

    // Check if performer id is valid
    if (!performerId) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Performer id is invalid",
      });
    }

    // Check if performer exists
    const performer = await performerController.getPerformerById(performerId);
    if (!performer) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Performer does not exist",
      });
    }

    // Check if rating is valid and between 1 and 5
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Rating is invalid, it must be between 1 and 5",
      });
    }

    const newRating = await performerRatingController.createRating(
      userId,
      performerId,
      rating,
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
    const { performerId } = req.body;

    // Check if performer id is valid
    if (!performerId) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Performer id is invalid",
      });
    }

    // Check if performer exists
    const performer = await performerController.getPerformerById(performerId);
    if (!performer) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Performer does not exist",
      });
    }

    const rating = await performerRatingController.getRatingByUserPerformer(
      userId,
      performerId
    );
    // Check if rating exists
    if (!rating) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Rating does not exist",
      });
    }

    await performerRatingController.deleteRatingByUserPerformer(
      userId,
      performerId
    );

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Rating removed",
      data: {},
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

router.post('/delete/performerratingid', authenticateToken, async (req, res) => {
  try {
    const { performerRatingId } = req.body;
    // Check if rating id is valid
    if (!performerRatingId) {
      return res.status(400).json({
          status: "error",
          code: 400,
          message: "Rating id is invalid",
      });
    }
    const rating = await performerRatingController.getRatingById(performerRatingId);
    // Check if rating exists
    if (!rating) {
      return res.status(404).json({
          status: "error",
          code: 404,
          message: "Rating does not exist",
      });
    }
    await performerRatingController.deleteRatingById(performerRatingId);
    return res.status(200).json({
        status: "success",
        code: 200,
        message: "Rating removed",
        data: rating,
    });
  } catch (err) {
    console.error("Error removing rating by id: ", err);
    return res.status(500).json({
        status: "error",
        code: 500,
        message: "Internal server error",
    });
  }
});

module.exports = router;