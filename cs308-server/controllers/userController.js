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

module.exports = {
  getUserById,
  createUser,
  // You can add other user-related controller functions here as needed
};
