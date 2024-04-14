const middleware = require('../middleware/jwt_middleware')

module.exports = function (pool, app) {
  app.get('/api/authorization', middleware.authenticateToken, async (req, res) => {
    try {
      const role = middleware.authorizeToken(req, res);
      res.status(200).json({ role: role });
    } catch (error) {
      console.error('Error authorizing user:', error);
      res.status(403).json({ error: 'An error occurred' });
    }
    
    
  })
}