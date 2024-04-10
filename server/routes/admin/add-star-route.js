require('dotenv').config();
const middleware = require('../../middleware/jwt_middleware');

module.exports = function (pool, app) {
  app.post('/api/admin/add-star', middleware.authenticateToken, async (req, res) => {
    try {
      const newStarData = req.body;
      console.log(newStarData);

      const client = await pool.connect();

      let queryString = {
        text: 'SELECT success, message FROM add_star($1, $2)',
        values: [newStarData.starName, newStarData.starYear]
      }

      const result = await client.query(queryString)
      console.log(result.rows[0]);

      res.json(result.rows[0]);

    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({error: 'An error occured'});
    }
  });
}