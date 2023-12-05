const express = require('express');
const router = express.Router();
const { transferDataFromExternalDB } = require('../helpers/dbHelpers');
const authenticateToken = require('../helpers/authToken');

// Endpoint to trigger data transfer
router.post('/transferDataFromExternalDB', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    await transferDataFromExternalDB(userId);
    res.status(200).json({ message: 'Data transfer completed successfully' });
  } catch (error) {
    console.error('Error in data transfer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
