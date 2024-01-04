const { Sequelize } = require('sequelize');

const externalDB = new Sequelize({
  dialect: 'mysql',
  timezone: '+03:00',
  host: process.env.EXTERNAL_DB_HOST,
  username: process.env.EXTERNAL_DB_USER,
  password: process.env.EXTERNAL_DB_PSWD,
  database: process.env.EXTERNAL_DB_NAME,
  define: {
    timestamps: false, // Disable createdAt and updatedAt globally
  },
})

module.exports = externalDB;