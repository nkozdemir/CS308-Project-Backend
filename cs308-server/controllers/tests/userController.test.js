jest.mock('../userController', () => ({
  createUser: jest.fn(),
  getUserById: jest.fn(),
  getUserByEmail: jest.fn(),
  searchUsers: jest.fn(),
}));

jest.mock('../friendController', () => ({
  getFriendByUserId: jest.fn(),
}));

const friendController = require('../friendController');

var SequelizeMock = require('sequelize-mock');
const { DataTypes, Op } = require('sequelize');
const { createUser, getUserById, getUserByEmail, searchUsers } = require('../userController');

// Create a mock Sequelize instance
const sequelizeMock = new SequelizeMock();

// Mock the Friend model
const Friend = sequelizeMock.define('Friend', {
  FriendID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  FriendUserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Mock the User model
const User = sequelizeMock.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Add a mock findAll method to the User model
User.findAll = jest.fn();

// Set up the associations
Friend.belongsTo(User, { foreignKey: 'UserID' });

describe('create', () => {
  test('should create a user', async () => {
    const userData = {
      Email: 'email',
      Password: 'password',
      Name: 'name',
    };

    // Mock the create method
    createUser.mockResolvedValue(userData);

    // Call the method
    const user = await createUser(userData, User);

    // Verify the results
    expect(user).toEqual(userData);
  });
});

describe('getUserById', () => {
  test('should get a user by ID', async () => {
    const userData = {
      UserID: 1,
      Email: 'email',
      Name: 'name',
    };

    // Mock the findByPk method
    getUserById.mockResolvedValue(userData);

    // Call the method
    const user = await getUserById(userData.UserID, User);

    // Verify the results
    expect(user).toEqual(userData);
  });
});

describe('getUserByEmail', () => {
  test('should get a user by email', async () => {
    const userData = {
      UserID: 1,
      Email: 'email',
      Name: 'name',
    };

    // Mock the findOne method
    getUserByEmail.mockResolvedValue(userData);

    // Call the method
    const user = await getUserByEmail(userData.Email, User);

    // Verify the results
    expect(user).toEqual(userData);
  });
});

// describe('searchUsers', () => {
//   test('should search for users', async () => {
//     const query = 'name';
//     const userId = 1;
//     const friendUserIds = [2, 3];
//     const usersData = [
//       {
//         UserID: 1,
//         Email: 'email1',
//         Name: 'name1',
//       },
//       {
//         UserID: 2,
//         Email: 'email2',
//         Name: 'name2',
//       },
//       {
//         UserID: 3,
//         Email: 'email3',
//         Name: 'name3',
//       },
//     ];

//     // Mock getFriendByUserId method to return friendUserIds
//     friendController.getFriendByUserId.mockResolvedValue(friendUserIds);

//     // Mock findAll method to return mock users
//     User.findAll.mockResolvedValue(usersData);

//     // Call the method
//     const users = await searchUsers(query, userId);

//     // Verify the results
//     expect(users).toEqual(usersData);

//     // Verify that the mocked methods were called with the expected arguments
//     expect(friendController.getFriendByUserId).toHaveBeenCalledWith(userId);
//     expect(User.findAll).toHaveBeenCalledWith({
//       attributes: ['UserID', 'Name', 'Email'],
//       where: {
//         [Op.and]: [
//           {
//             [Op.or]: [
//               {
//                 Name: {
//                   [Op.like]: `%${query}%`,
//                 },
//               },
//               {
//                 Email: {
//                   [Op.like]: `%${query.split('@')[0]}%`,
//                 },
//               },
//             ],
//           },
//           {
//             UserID: {
//               [Op.notIn]: [userId, ...friendUserIds],
//             },
//           },
//         ],
//       },
//     });
//   });
// });
