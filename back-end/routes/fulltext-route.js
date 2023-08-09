module.exports = function (pool, app) {
    app.get('/api/fulltext', async (req, res) => {
        const input = req.query.input;
        const tokens = temp.trim().split(" ").map((str) => str+":*");
        const newInput = tokens.join(" & ")

        try {
            const client = await pool.connect();
            let queryString = {
                text: 'SELECT * FROM movies WHERE ts @@ to_tsquery($1) LIMIT 6',
                values: [newInput]
            }

            const result = await client.query(queryString)
            
            let moviesList = [];

            for ( let i=0; i < result.rows.length; ++i ) {
                let movieObj = {};
                
                movieObj.movieId = result.rows[i].id;
                movieObj.movieTitle = result.rows[i].title;

                moviesList.push(movieObj)
            }
            console.log(moviesList);
            res.json(moviesList)

            client.release();
            
        } catch(error) {
            console.log(error);
        }
    })
}