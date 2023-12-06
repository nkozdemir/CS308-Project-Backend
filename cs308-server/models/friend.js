const { DataTypes } = require('sequelize');
const connection = require('../config/db');
const UserModel = require('../models/user');

const Friend = connection.define('Friend', {
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
}, {
  freezeTableName: true,
});

Friend.belongsTo(UserModel, {
    foreignKey: 'FriendUserID', // This should match the field in the Friend model
    as: 'FriendInfo',
  });

module.exports = Friend;
