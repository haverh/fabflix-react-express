
module.exports = function (pool, app) {
    app.get('/api/topmovies', async (req, res) => {
        try { 
            const client = await pool.connect();
            const result = await client.query('SELECT rating, movieId FROM ratings ORDER BY rating DESC LIMIT 20;');
    
            // Array to hold all movies
            let moviesList = [];
    
            // Iterate through each movie
            // Create object to hold all info (stars, genres, movie info)
            for ( let i=0; i < result.rows.length; ++i ) {
                let movieObj = {}
    
                movieObj.movieId = result.rows[i].movieid;
                movieObj.movieRating = result.rows[i].rating;
    
                let queryString = {
                    text: 'SELECT title, year, director FROM movies WHERE id = $1',
                    values: [movieObj.movieId]
                }
    
                const moviesResult = await client.query(queryString)
                
                movieObj.movieTitle = moviesResult.rows[0].title;
                movieObj.movieYear = moviesResult.rows[0].year;
                movieObj.movieDirector = moviesResult.rows[0].director;
                
                // Arrays to hold a list of stars/genres per movie
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
    
                moviesList.push(movieObj);
    
            }
            // console.log(moviesList)
            res.json(moviesList);
    
            client.release();
            } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
            }
      });
  };