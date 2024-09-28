const jwt = require('jsonwebtoken');
const JWT_SECRET = 'admin'; // Use the same secret as in server.js

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).json({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  });
}

module.exports = verifyToken;
