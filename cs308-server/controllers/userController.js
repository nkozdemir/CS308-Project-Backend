const User = require('../models/user');
const { Op } = require('sequelize');

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
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['Password'] },
    });
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

async function searchUsers(query) {
  try {
    const users = await User.findAll({
      attributes: ['UserID', 'Name', 'Email'], // Specify the fields you want to retrieve
      where: {
        [Op.or]: [
          {
            Name: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            Email: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      },
    });
    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}

module.exports = {
  getUserById,
  createUser,
  getUserByEmail,
  searchUsers,
  // You can add other user-related controller functions here as needed
};
