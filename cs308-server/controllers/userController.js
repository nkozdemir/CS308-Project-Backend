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

async function getUserByEmail(email) {
  try {
    const user = await User.findOne({
      where: {
        Email: email,
      },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

module.exports = {
  getUserById,
  createUser,
  getUserByEmail,
  // You can add other user-related controller functions here as needed
};
