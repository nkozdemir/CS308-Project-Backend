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
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Unauthorized - Token expired', expiredAt: err.expiredAt });
      } else {
        return res.status(403).json({ error: 'Forbidden - Token verification failed' });
      }
    }
    req.user = decoded; 
    next();
  });
}

module.exports = authenticateToken;