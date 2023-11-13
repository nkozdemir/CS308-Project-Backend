require('dotenv').config();

const express = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validateLogin } = require('../schemaValidator');
const mysql = require('mysql2');
let { refreshTokens } = require('./refreshTokens');

const app = express()
app.use(express.json());
const port = 4000;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PSWD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
})
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to db!');
});

app.post('/token' , (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, userData) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(userData);
    res.json({ accessToken: accessToken });
  })
})

app.post('/login', (req, res) => {
  const { error, value } = validateLogin(req.body);
  if (error) {
    res.status(400).send(error.details.map((detail) => detail.message).join('\n'));
  }
  const { email, password } = value;
  connection.query(`SELECT * FROM User WHERE Email='${email}'`, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.status(400).send('User does not exist');
    } else {
      //console.log(result[0]);
      const userData = result[0];
      bcrypt.compare(password, result[0].Password, (err, result) => {
        if (err) throw err;
        if (result) {
          const accessToken = generateAccessToken(userData);
          const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);
          refreshTokens.push(refreshToken);
          res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
        } else {
          res.status(400).send('Incorrect password');
        }
      })
    }
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
})

function generateAccessToken(userData) {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
}

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})