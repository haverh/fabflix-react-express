module.exports = function (pool, app) {
    app.get('/api/single-star', async (req, res) => {
        const starId = req.query.starId;

        try {
            const client = await pool.connect();

            let queryString = {
                text: 'SELECT name, birthyear, sim.movieid, title, year director, rating  FROM stars s' + 
                'JOIN stars_in_movies sim ON s.id = sim.starId JOIN movies m ON sim.movieId = m.id' +
                'JOIN ratings r ON m.id = r.movieId WHERE starId = $1',
                values: [starId]
            }

            const result = await client.query(queryString)

            let starInfo = {};

            starInfo.starName = result.rows[0].name;
            starInfo.starBirth = result.rows[0].birthyear;

            starInfo.starMoviesList = [];

            for ( let i=0; i < result.rows.length; ++i ) {
                let movieObj = {};
                
                movieObj.movieId = result.rows[i].movieid;
                movieObj.movieTitle = result.rows[i].title;
                movieObj.movieYear = result.rows[i].year;
                movieObj.movieDirector = result.rows[i].director;
                movieObj.movieRating = result.rows[i].rating;

                movieObj.movieStars = []
                movieObj.movieGenres = [];

                queryString.text = 'SELECT starId, name FROM stars_in_movies sim JOIN stars s ON sim.starId = s.id WHERE movieId = $1'
                queryString.values[0] = movieObj.movieId;
    
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

                starInfo.starMoviesList.push(movieObj);
            }

            console.log(starInfo);
            res.json(starInfo)

            client.release();
            
        } catch(error) {
            console.log(error);
        }
    })
}