const User = require('../models/user');

async function createUser(email, password, name) {
  try {
    const user = await User.create({
      Email: email,
      Password: password,
      Name: name,
    });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}

// A method to validate user with given id
async function validateUser(userId) {
  try {
    // Check if userId is valid
    if (!userId) {
      return false;
    }
    const user = await User.findByPk(userId);
    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error validating user:', error);
    throw error;
  }
}

module.exports = {
  getUserById,
  createUser,
  validateUser,
  // You can add other user-related controller functions here as needed
};
