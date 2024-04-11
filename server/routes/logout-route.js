const middleware = require('../middleware/jwt_middleware');

module.exports = function (pool, app) {
  app.post('/api/logout', async (req, res) => {
    res.clearCookie('accessToken');
    res.json({ message: 'Logged out successfully' });
  })
}