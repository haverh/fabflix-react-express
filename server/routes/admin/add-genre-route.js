require('dotenv').config();
const middleware = require('../../middleware/jwt_middleware');

module.exports = function (pool, app) {
  app.post('/api/admin/add-genre', middleware.authenticateToken, async (req, res) => {
    try {
      const newGenreData = req.body;
      console.log(newGenreData);

      const client = await pool.connect();

      let queryString = {
        text: 'SELECT success, message FROM add_genre($1)',
        values: [newGenreData.genreName]
      }

      const result = await client.query(queryString)
      console.log(result.rows[0]);

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({error: 'An error occured'});
    }
  })
}