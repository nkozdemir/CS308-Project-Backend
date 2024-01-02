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

router.get('/search', authenticateToken, async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(404).json({
            status: 'error',
            code: 404,
            message: 'Query parameter is required'
        });
    }

    try {
        const users = await userController.searchUsers(query, req.user.id);
  
        res.status(200).json({ 
            status: 'success',
            code: 200,
            message: 'Users retrieved successfully',
            data: users 
        });
    } catch (error) {
        console.error('Error searching for users:', error);
        res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Internal Server Error'
        });
    }
});

module.exports = router;