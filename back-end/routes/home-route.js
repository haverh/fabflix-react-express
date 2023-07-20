module.exports = function (pool, app) {
    
    app.get('/api/homeDetails', async (req, res) => {
        try {
            const client = await pool.connect();
            let queryString = {
                text: 'select * from genres order by name;',
                values: []
            };

            const result = await client.query(queryString)
            const genreList = [...result.rows];
            
            // console.log(genreList)
            res.json(genreList);
        
            client.release();
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred' });
        }


            
    });
};

