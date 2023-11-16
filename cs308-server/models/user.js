const { DataTypes } = require('sequelize');
const connection = require('../config/db'); // Assuming you have a MySQL connection setup

const User = connection.define('User', {
  userid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // You can include other fields that you need for your application
});

module.exports = User;
