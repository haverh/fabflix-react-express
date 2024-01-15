const middleware = require('../middleware/jwt_middleware');

module.exports = function (pool, app) {
    
    app.get('/api/cart/price', middleware.authenticateToken, async (req, res) => {
        try {

            const movieId = req.query.movieId

            const client = await pool.connect();
            let queryString = {
                text: 'select price from movie_prices where movieid = $1;',
                values: [movieId]
            };

            const result = await client.query(queryString)
            const movieObj = {};

            movieObj.movieId = movieId;
            movieObj.price = result.rows[0].price;
            // console.log(movieObj);
            res.json(movieObj);
        
            client.release();
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        }


            
    });
};
