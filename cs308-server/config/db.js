const { Sequelize } = require('sequelize');

const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PSWD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  timezone: '+03:00',
  define: {
    timestamps: false,
  },
  dialectOptions: {
    // Options specific to the mysql2 library
    // For example, you can set the timezone:
    dateStrings: true,
    typeCast: true,
  },
});

// Test the connection
connection.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = connection;