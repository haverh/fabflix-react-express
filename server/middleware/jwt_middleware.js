const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate token for user
const generateAccessToken = (username) => {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '24h' });
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

        next();
    });
}

module.exports = {
    generateAccessToken,
    authenticateToken,
}