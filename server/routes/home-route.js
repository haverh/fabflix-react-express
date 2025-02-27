const middleware = require('../middleware/jwt_middleware');

module.exports = function (pool, app) {
    
    app.get('/api/homeDetails', middleware.authenticateToken, async (req, res) => {
        try {
            // console.log("HOME", req.cookies.accessToken)
            const client = await pool.connect();
            let queryString = {
                text: 'select * from genres order by name;',
                values: []
            };

            const result = await client.query(queryString)
            const genreList = [...result.rows];

            // console.log(genreList)
            // res.json(genreList);
            res.status(200).json({ genreList: genreList });
        
            client.release();
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    });

    app.get('/api/byStartCharacter', middleware.authenticateToken, async (req, res) => {
        try {
            console.time("Start Character");
            console.log(req.query);
            const { startCharacter, sortOrder, sortBy } = req.query;
            const currentPage = parseInt(req.query.currentPage, 10);
            const perPage = parseInt(req.query.perPage, 10);
            const numPage = parseInt(req.query.numPage, 10);
            let offset;
            const limit = perPage * numPage;

            const client = await pool.connect();

            let queryString = {
                text: `SELECT COUNT(*) FROM movies WHERE title ILIKE $1`,
                values: [`${startCharacter}%`]
            };

            let resultObj = {};
            let moviesList = [];

            if ( currentPage == 1 ) {
                offset = (currentPage - 1) * perPage ;
                const result = await client.query(queryString);
                resultObj.total = parseInt(result.rows[0].count);
            }else { 
                offset = currentPage  * perPage;
            }
            queryString.text = `SELECT rating, movieid, title, year, director, poster FROM movies JOIN ratings ` +
                                `ON id=movieid WHERE title ILIKE $1 ORDER BY ${sortBy} ${sortOrder}, numVotes DESC ` +
                                `OFFSET ${offset} LIMIT ${limit};`

            const result = await client.query(queryString)
    
            // Iterate through each movie
            // Create object to hold all info (stars, genres, movie info)
            for ( let i=0; i < result.rows.length; ++i ) {
                let movieObj = {}
    
                movieObj.movieId = result.rows[i].movieid;
                movieObj.movieRating = result.rows[i].rating;                
                movieObj.movieTitle = result.rows[i].title;
                movieObj.movieYear = result.rows[i].year;
                movieObj.movieDirector = result.rows[i].director;
                movieObj.moviePoster = result.rows[i].poster;
                
                // // Arrays to hold a list of stars/genres per movie
                // movieObj.movieStars = [];
                // movieObj.movieGenres = [];
    
                // queryString.text = 'SELECT starId, name FROM stars_in_movies sim JOIN stars s ON sim.starId = s.id WHERE movieId = $1'
                // queryString.values = [movieObj.movieId];

                // const starsResult = await client.query(queryString)
    
                // // Iterate through the stars object array
                // for ( let j=0; j < starsResult.rows.length; ++j ) {
                //     let starObj = {}
    
                //     starObj.starId = starsResult.rows[j].starid;
                //     starObj.starName = starsResult.rows[j].name;
                //     movieObj.movieStars.push(starObj);
                // }
    
                // queryString.text = 'SELECT genreId, name FROM genres_in_movies gim JOIN genres g ON gim.genreId = g.id WHERE movieId = $1'
    
                // const genreResult = await client.query(queryString)
    
                // // Iterate through the genres object array
                // for ( let k=0; k < genreResult.rows.length; ++k ) {
                //     let genreObj = {}
    
                //     genreObj.genreId = genreResult.rows[k].genreid;
                //     genreObj.genreName = genreResult.rows[k].name;
                //     movieObj.movieGenres.push(genreObj);
                // }
    
                moviesList.push(movieObj);
            }
            console.timeEnd("Start Character");
            resultObj.moviesList = moviesList;
            // console.log(resultObj);
            res.json(resultObj);
        
            client.release();
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    });

    app.get('/api/byGenre', middleware.authenticateToken, async (req, res) => {
        try {
            console.time("Genre");
            console.log(req.query);
            const { genreId, sortOrder, sortBy } = req.query;
            const currentPage = parseInt(req.query.currentPage, 10);
            const perPage = parseInt(req.query.perPage, 10);
            const numPage = parseInt(req.query.numPage, 10);
            let offset;
            const limit = perPage * numPage;

            const client = await pool.connect();

            let queryString = {
                text: `SELECT COUNT(*) FROM movies JOIN genres_in_movies ` +
                        `ON id=movieId WHERE genreId = ${genreId}`,
                values: []
            };

            let resultObj = {};
            let moviesList = [];

            if ( currentPage == 1 ) {
                offset = (currentPage - 1) * perPage;
                const result = await client.query(queryString);
                resultObj.total = parseInt(result.rows[0].count);
            }else { 
                offset = (currentPage) * perPage;
            }
            console.time("50 Records");
            queryString.text = `SELECT rating, id as movieid, title, year, director, poster FROM movies ` +
                                `JOIN ratings ON id=movieid JOIN genres_in_movies on id=genres_in_movies.movieid ` +
                                `WHERE genreid = ${genreId} ORDER BY ${sortBy} ${sortOrder}, numVotes DESC ` +
                                `OFFSET ${offset} LIMIT ${limit}`

            const result = await client.query(queryString)
            console.timeEnd("50 Records");

            let getStarTime = 0
            let getGenreTime = 0
    
            // Iterate through each movie
            // Create object to hold all info (stars, genres, movie info)
            
            for ( let i=0; i < result.rows.length; ++i ) {
                let movieObj = {}
    
                movieObj.movieId = result.rows[i].movieid;
                movieObj.movieRating = result.rows[i].rating;                
                movieObj.movieTitle = result.rows[i].title;
                movieObj.movieYear = result.rows[i].year;
                movieObj.movieDirector = result.rows[i].director;
                movieObj.moviePoster = result.rows[i].poster;
                
                // // Arrays to hold a list of stars/genres per movie
                // movieObj.movieStars = [];
                // movieObj.movieGenres = [];
                
                // let t0 = performance.now()
                // queryString.text = 'SELECT starId, name FROM stars_in_movies sim JOIN stars s ON sim.starId = s.id WHERE movieId = $1'
                // queryString.values = [movieObj.movieId];

                // const starsResult = await client.query(queryString)
                // getStarTime += (performance.now() - t0)

                // // Iterate through the stars object array
                // for ( let j=0; j < starsResult.rows.length; ++j ) {
                //     let starObj = {}
    
                //     starObj.starId = starsResult.rows[j].starid;
                //     starObj.starName = starsResult.rows[j].name;
                //     movieObj.movieStars.push(starObj);
                // }
                
                // let t1 = performance.now()
                // queryString.text = 'SELECT genreId, name FROM genres_in_movies gim JOIN genres g ON gim.genreId = g.id WHERE movieId = $1'
    
                // const genreResult = await client.query(queryString)
                // getGenreTime += (performance.now() - t1)

                // // Iterate through the genres object array
                // for ( let k=0; k < genreResult.rows.length; ++k ) {
                //     let genreObj = {}
    
                //     genreObj.genreId = genreResult.rows[k].genreid;
                //     genreObj.genreName = genreResult.rows[k].name;
                //     movieObj.movieGenres.push(genreObj);
                // }
    
                moviesList.push(movieObj);
            }
            

            console.timeEnd("Genre");
            console.log(`Get Stars: ${getStarTime} ms`)
            console.log(`Get Genres: ${getStarTime} ms`)
            resultObj.moviesList = moviesList;
            // console.log(resultObj);
            res.json(resultObj);
        
            client.release();
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        }


            
    });
};
