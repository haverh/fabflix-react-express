const middleware = require('../middleware/jwt_middleware');

module.exports = function (pool, app) {
    app.get('/api/topmovies', middleware.authenticateToken, async (req, res) => {
        try { 
            console.time("Top Movies");
            const client = await pool.connect();
            const result = await client.query(`SELECT rating, movieid, title, year, director, poster
                                                FROM movies m, ratings r
                                                WHERE m.id=r.movieId
                                                ORDER BY rating DESC
                                                LIMIT 20;`);
            // Array to hold all movies
            let moviesList = [];
    
            // Iterate through each movie
            // Create object to hold all info (stars, genres, movie info)
            // for ( let i=0; i < result.rows.length; ++i ) {
            //     console.time("SERVER FETCHING TIME");
            //     let movieObj = {}
    
            //     movieObj.movieId = result.rows[i].movieid;
            //     movieObj.movieRating = result.rows[i].rating;
    
            //     let queryString = {
            //         text: 'SELECT title, year, director FROM movies WHERE id = $1',
            //         values: [movieObj.movieId]
            //     }
    
            //     const moviesResult = await client.query(queryString)
                
            //     movieObj.movieTitle = moviesResult.rows[0].title;
            //     movieObj.movieYear = moviesResult.rows[0].year;
            //     movieObj.movieDirector = moviesResult.rows[0].director;
                
            //     // Arrays to hold a list of stars/genres per movie
            //     movieObj.movieStars = [];
            //     movieObj.movieGenres = [];
    
            //     queryString.text = 'SELECT starId, name FROM stars_in_movies sim JOIN stars s ON sim.starId = s.id WHERE movieId = $1'
    
            //     const starsResult = await client.query(queryString)
    
            //     // Iterate through the stars object array
            //     for ( let j=0; j < starsResult.rows.length; ++j ) {
            //         let starObj = {}
    
            //         starObj.starId = starsResult.rows[j].starid;
            //         starObj.starName = starsResult.rows[j].name;
            //         movieObj.movieStars.push(starObj);
            //     }
    
            //     queryString.text = 'SELECT genreId, name FROM genres_in_movies gim JOIN genres g ON gim.genreId = g.id WHERE movieId = $1'
    
            //     const genreResult = await client.query(queryString)
    
            //     // Iterate through the genres object array
            //     for ( let k=0; k < genreResult.rows.length; ++k ) {
            //         let genreObj = {}
    
            //         genreObj.genreId = genreResult.rows[k].genreid;
            //         genreObj.genreName = genreResult.rows[k].name;
            //         movieObj.movieGenres.push(genreObj);
            //     }
    
            //     moviesList.push(movieObj);
            //     console.timeEnd("SERVER FETCHING TIME");
    
            // }

            const movies = result.rows.map((row) => { 
                return { 
                    movieId: row.movieid, 
                    movieRating: row.rating,
                    movieTitle: row.title,
                    movieYear: row.year,
                    movieDirector: row.director,
                    moviePoster: row.poster
                } 
            });

            const batchsize = 10;

            try {
                await client.query('BEGIN');

                for (let i = 0; i < movies.length; i += batchsize) {
                    const batch = movies.slice(i, i + batchsize);

                    const promises = batch.map(async (movie) => {
                        // console.log("MOVIE -", movie)
                        const movieObj = movie;

                        const starsQueryString = {
                            text: 'SELECT starId, name FROM stars_in_movies sim JOIN stars s ON sim.starId = s.id WHERE movieId = $1',
                            values: [movie.movieId],
                        };
                    
                        const starsResult = await client.query(starsQueryString);
                        movieObj.movieStars = starsResult.rows;
                    
                        const genresQueryString = {
                            text: 'SELECT genreId, name FROM genres_in_movies gim JOIN genres g ON gim.genreId = g.id WHERE movieId = $1',
                            values: [movie.movieId],
                        };
                    
                        const genreResult = await client.query(genresQueryString);
                        movieObj.movieGenres = genreResult.rows;

                        // console.log("MOVIE OBJECT -", movieObj)
                    
                        return movieObj;
                    })

                    const batchResults = await Promise.all(promises);
                    moviesList.push(...batchResults);
                }  
                
                await client.query('COMMIT');
            } catch (error) {
                await client.query('ROLLBACK');
                console.error('Error:', error);
            } finally {
                client.end();
            }

            // console.log(moviesList)
            console.timeEnd("Top Movies");
            res.json(moviesList);
    
            client.release();
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    });
  };