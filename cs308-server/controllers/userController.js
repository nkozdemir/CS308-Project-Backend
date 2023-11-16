const User = require('../models/user');

async function getUserById(userId) {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}

module.exports = {
  getUserById,
  // You can add other user-related controller functions here as needed
};
