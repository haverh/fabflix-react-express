require('dotenv').config();
const express = require('express');
const {Pool} = require('pg');
const cors = require('cors');
// const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { auth } = require('express-openid-connect');
require('dotenv').config();

const app = express();
const port = 5000;

// Parse URL-encoded bodies
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ["GET", "POST"],
    credentials: true,
  }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup Auth0 config
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER,
};

app.use(auth(config));

// Setup session
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         expires: 60 * 60 * 24,
//       },
// }));


// Setup connection pool
const pool = new Pool({
    user: 'myuser',
    host: 'localhost',
    database: 'moviedb',
    password: 'My6Pa$$word',
    port: 5432,
})

// Routes
const landingRoutes = require('./routes/landing-route');
const homeRoutes = require('./routes/home-route');
const cartRoutes = require('./routes/cart-route');
const fulltextRoutes = require('./routes/fulltext-route');
const topMoviesRoutes = require('./routes/top-movies-route'); // Top Movies
const singleMovieRoutes = require('./routes/single-movie-route'); // Single Movie
const singleStarRoutes = require('./routes/single-star-route'); // Single Movie

landingRoutes(app);
homeRoutes(pool, app);
cartRoutes(pool, app);
fulltextRoutes(pool, app);
topMoviesRoutes(pool, app);
singleMovieRoutes(pool, app);
singleStarRoutes(pool, app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})