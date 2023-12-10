const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../helpers/authToken");

router.get("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userController.getUserById(userId);
        return res.status(200).json({
            status: "success",
            code: 200,
            message: "User retrieved successfully",
            data: user,
        });
    } catch (error) {
        console.error("Error in userRoutes.js: ", error.message);
        return res.status(500).json({
            status: "error",
            code: 500,
            message: error.message,
        });
    }
});

module.exports = router;