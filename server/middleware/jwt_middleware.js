const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate token for user
const generateAccessToken = (_username, _role) => {
  return jwt.sign({user: _username, role:_role}, process.env.TOKEN_SECRET, { expiresIn: '24h' });
}

// Authenticate user access
const authenticateToken = (req, res, next) => {
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];
  const token = req.cookies.accessToken;

  if (token === null || token === undefined) return res.status(401).json({
    name: "NoTokenError",
    message: "token is null or undefined",
  })

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json(err);
    req.user = user;
    const decodedToken = jwt.decode(token);
    // console.log(decodedToken)
    next();
  });
}

const authorizeToken = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return null;
  }

  const decodedToken = jwt.decode(token);

  if (!decodedToken) {
    return null;
  }

  return {
    role: decodedToken.role,
    user: decodedToken.user
  };
}

module.exports = {
  generateAccessToken,
  authenticateToken,
  authorizeToken,
}