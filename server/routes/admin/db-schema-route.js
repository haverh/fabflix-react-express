require('dotenv').config();
const middleware = require('../../middleware/jwt_middleware');
const axios = require('axios');

module.exports = function (pool, app) {
  app.get('/api/admin/get-schema', middleware.authenticateToken, async (req, res) => {
    try {
      const tablesArray = [];
      const client = await pool.connect();

      tables_query = {
        text: `SELECT table_name FROM information_schema.tables WHERE table_schema=$1 AND table_type=$2 ORDER BY table_name`,
        values: ['public', 'BASE TABLE']
      }

      tables_result = await client.query(tables_query);
      console.log(tables_result.rows);

      for ( let i=0; i < tables_result.rows.length; ++i ) {
        let tableObj = {
          'table_name': tables_result.rows[i].table_name,
        };

        table_info_query = {
          text: 'SELECT column_name, data_type FROM information_schema.columns WHERE table_name=$1',
          values: [tables_result.rows[i].table_name]
        }

        table_info_result = await client.query(table_info_query);

        tableObj['fields'] = table_info_result.rows;
        tablesArray.push(tableObj);
        // console.log(tableObj);
      }
      console.log(tablesArray)

      res.json(tablesArray);
  
      client.release();
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  })
}