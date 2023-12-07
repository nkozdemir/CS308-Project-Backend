const express = require('express');
const router = express.Router();

const songRatingRoutes = require('./songRatingRoutes');

// Use the modular routes under /rating/song
router.use('/song', songRatingRoutes);

// Use the modular routes under /rating/performer

module.exports = router;