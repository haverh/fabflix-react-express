const middleware = require('../middleware/jwt_middleware');

module.exports = function (pool, app) {
    app.get('/api/single-movie', middleware.authenticateToken, async (req, res) =>{
        const movieId = req.query.movieId
        
        try {
            const client = await pool.connect();
            let queryString = {
                text: 'SELECT title, year, director, poster, rating FROM movies LEFT JOIN ratings ON id = movieId WHERE id = $1',
                values: [movieId]
            }

            const result = await client.query(queryString);

            let movieObj = {};
            movieObj.movieTitle = result.rows[0].title;
            movieObj.movieYear = result.rows[0].year;
            movieObj.movieDirector = result.rows[0].director;
            movieObj.moviePoster = result.rows[0].poster;
            movieObj.movieRating = result.rows[0].rating ? result.rows[0].rating : "N/A";

            movieObj.movieStars = [];
            movieObj.movieGenres = [];

            queryString.text = 'SELECT starId, name FROM stars_in_movies sim JOIN stars s ON sim.starId = s.id WHERE movieId = $1'
    
            const starsResult = await client.query(queryString)

            // Iterate through the stars object array
            for ( let j=0; j < starsResult.rows.length; ++j ) {
                let starObj = {}

                starObj.starId = starsResult.rows[j].starid;
                starObj.starName = starsResult.rows[j].name;
                movieObj.movieStars.push(starObj);
            }

            queryString.text = 'SELECT genreId, name FROM genres_in_movies gim JOIN genres g ON gim.genreId = g.id WHERE movieId = $1'

            const genreResult = await client.query(queryString)

            // Iterate through the genres object array
            for ( let k=0; k < genreResult.rows.length; ++k ) {
                let genreObj = {}

                genreObj.genreId = genreResult.rows[k].genreid;
                genreObj.genreName = genreResult.rows[k].name;
                movieObj.movieGenres.push(genreObj);
            }
            // console.log(movieObj);
            res.json(movieObj);

            client.release();

        } catch (error) {
            console.log(error);
        }
    })
}