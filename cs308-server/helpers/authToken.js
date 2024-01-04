require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Unauthorized - No token provided',
    }); 
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: `Unauthorized - Token expired at ${err.expiredAt}`, 
        });
      } else {
        return res.status(403).json({
          status: 'error',
          code: 403, 
          message: 'Forbidden - Token verification failed' 
        });
      }
    }
    
    req.user = decoded; 
    next();
  });
}

module.exports = authenticateToken;