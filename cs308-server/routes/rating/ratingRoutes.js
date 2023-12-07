const express = require('express');
const router = express.Router();

const songRatingRoutes = require('./songRatingRoutes');
const performerRatingRoutes = require('./performerRatingRoutes');

// Use the modular routes under /rating/song
router.use('/song', songRatingRoutes);

// Use the modular routes under /rating/performer
router.use('/performer', performerRatingRoutes);

module.exports = router;