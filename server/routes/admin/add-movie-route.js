require('dotenv').config();
const middleware = require('../../middleware/jwt_middleware');
const axios = require('axios');

module.exports = function (pool, app) {
  
  app.post('/api/admin/add-movie', middleware.authenticateToken, async (req, res) => {
    try {
      const newMovieData = req.body;
      console.log(newMovieData)

      const client = await pool.connect();
      let queryString = {
        text: 'SELECT success, message from add_movie($1, $2, $3, $4, $5, $6, $7)',
        values: [newMovieData.movieId, newMovieData.movieTitle, newMovieData.movieYear, newMovieData.movieDirector,
                newMovieData.moviePoster, newMovieData.movieRating, newMovieData.movieNumRating]
      }

      const result = await client.query(queryString)

      console.log(result.rows[0])

      newMovieData.movieStars.forEach(async (star) => {
        const starQuery = {
          text: 'SELECT add_star_to_movie($1, $2, $3)',
          values: [star.name, star.birthyear, newMovieData.movieId]
        }

        const starResult = await client.query(starQuery);
        
        // console.log(starResult.rows);
      })

      newMovieData.movieGenres.forEach(async (genre) => {
        const genreQuery = {
          text: 'SELECT add_genre_to_movie($1, $2)',
          values: [genre, newMovieData.movieId]
        }

        const genreResult = await client.query(genreQuery);

        // console.log(genreResult.rows);
      })
      
      const movieObj = {};

      // movieObj.movieId = movieId;
      // movieObj.price = result.rows[0].price;
      // console.log(movieObj);
      res.json(result.rows[0]);
  
      client.release();
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
};