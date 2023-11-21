require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user'); 
const { validateLogin } = require('../schemaValidator');

const authMiddleware = express.Router();
authMiddleware.use(express.json());

let refreshTokens = [];

authMiddleware.post('/token', async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  try {
    const userData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(userData);

    res.json({ accessToken });
  } catch (err) {
    return res.sendStatus(403);
  }
});

authMiddleware.post('/login', async (req, res) => {
  try {
    const { error, value } = validateLogin(req.body);

    if (error) {
      return res.status(400).send(error.details.map((detail) => detail.message).join('\n'));
    }

    const { email, password } = value;

    // Use Sequelize to find the user by email
    const user = await User.findOne({ where: { Email: email } });

    if (!user) {
      return res.status(400).send('User does not exist');
    }

    // Compare passwords using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.Password);

    if (passwordMatch) {
      // Generate access token
      const accessToken = generateAccessToken({ id: user.UserID, email: user.Email });

      // Generate refresh token
      const refreshToken = jwt.sign({ id: user.UserID, email: user.Email }, process.env.REFRESH_TOKEN_SECRET);
      
      // Store refresh token (you need to implement your own logic for storing and managing refresh tokens)
      // For example, you can store them in a database or an in-memory array
      refreshTokens.push(refreshToken);

      return res.status(200).json({ accessToken, refreshToken });
    } else {
      return res.status(400).send('Incorrect password');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

authMiddleware.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

function generateAccessToken(userData) {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
}

module.exports = authMiddleware;