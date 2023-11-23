require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = decoded; 
    console.log("User", req.user);
    next();
  });
}

module.exports = authenticateToken;