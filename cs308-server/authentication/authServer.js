require('dotenv').config();

const express = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('../config/db');
const { validateLogin } = require('../schemaValidator');

const authMiddleware = express.Router();
authMiddleware.use(express.json());

let refreshTokens = [];

authMiddleware.post('/token' , (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, userData) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(userData);
    res.json({ accessToken: accessToken });
  })
})

authMiddleware.post('/login', (req, res) => {
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

authMiddleware.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
})

function generateAccessToken(userData) {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
}

module.exports = authMiddleware;