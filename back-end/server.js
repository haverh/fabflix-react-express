require('dotenv').config();
const express = require('express');
const {Pool} = require('pg');
const cors = require('cors')
const session = require('express-session');
const fs = require('fs');
const path = require('path')
const crypto = require('crypto');


const app = express();
const port = 5000;


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
  }));


// Generate session key if it doesn't exist in .env
const envPath = path.resolve(__dirname, '.env');
if (!fs.existsSync(envPath) || !fs.readFileSync(envPath, 'utf8').includes('SESSION_SECRET')) {
    const sessionSecret = crypto.randomBytes(32).toString('hex');

    fs.appendFileSync(envPath, `\nSESSION_SECRET=${sessionSecret}`);
}


// Setup session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));


// Setup connection pool
const pool = new Pool({
    user: 'myuser',
    host: 'localhost',
    database: 'moviedb',
    password: 'My6Pa$$word',
    port: 5432,
})


// Routes
const topMoviesRoutes = require('./routes/top-movies-route'); // Top Movies
const singleMovieRoutes = require('./routes/single-movie-route'); // Single Movie
const singleStarRoutes = require('./routes/single-star-route'); // Single Movie

topMoviesRoutes(pool, app);
singleMovieRoutes(pool, app);
singleStarRoutes(pool, app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})