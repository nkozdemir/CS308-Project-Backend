const express = require('express');
const router = express.Router();
const { transferDataFromExternalDB } = require('../helpers/dbHelpers');
const authenticateToken = require('../helpers/authToken');

// Endpoint to trigger data transfer
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    await transferDataFromExternalDB(userId);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Data transfer completed successfully',
      data: []
    });
  } catch (error) {
    console.error('Error in data transfer:', error);
    res.status(500).json({ 
      status: 'error',
      code: 500,
      message: 'Internal Server Error' 
    });
  }
});

module.exports = router;
