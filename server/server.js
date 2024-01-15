require('dotenv').config();
const express = require('express');
const {Pool} = require('pg');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
const { sql } = require("@vercel/postgres");
const middleware = require('./middleware/jwt_middleware');

const app = express();
const port = 5000;


// Parse URL-encoded bodies
app.use(express.json());
app.use(cors({
    origin: [process.env.LOCAL_CLIENT_URL],
    methods: ["GET", "POST"],
    credentials: true,
  }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(middleware.generateAccessToken); 
// app.use(middleware.authenticateToken);

// Setup Auth0 config
// const config = {
//     authRequired: false,
//     auth0Logout: true,
//     secret: process.env.SECRET,
//     baseURL: process.env.BASEURL,
//     clientID: process.env.CLIENTID,
//     issuerBaseURL: process.env.ISSUER,
// };

// app.use(auth(config));

// Setup session
// app.set('trust proxy', 1);
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false,
//         maxAge: 1000 * 60  * 60 * 24,
//       },
// }));
// app.use(session({
//     genid: (req) => {
//         return genuuid()
//     },
//     secret: process.env.SESSION_SECRET
// }))

// JWT



// Setup connection pool
const pool = new Pool({
    user: process.env.LOCAL_PG_USER,
    host: process.env.LOCAL_PG_HOST,
    database: process.env.LOCAL_PG_DATABASE,
    password: process.env.LOCAL_PG_PASSWORD,
    port: 5432,
    // ssl: {
    //     rejectUnauthorized: false,
    // },
})

// Routes
const landingRoutes = require('./routes/landing-route');
const loginRoutes = require('./routes/login-route');
const homeRoutes = require('./routes/home-route');
const cartRoutes = require('./routes/cart-route');
const checkoutRoutes = require('./routes/checkout-route');
const fulltextRoutes = require('./routes/fulltext-route');
const topMoviesRoutes = require('./routes/top-movies-route'); // Top Movies
const singleMovieRoutes = require('./routes/single-movie-route'); // Single Movie
const singleStarRoutes = require('./routes/single-star-route'); // Single Movie

landingRoutes(app);
loginRoutes(pool, app);
homeRoutes(pool, app);
cartRoutes(pool, app);
checkoutRoutes(pool, app);
fulltextRoutes(pool, app);
topMoviesRoutes(pool, app);
singleMovieRoutes(pool, app);
singleStarRoutes(pool, app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

module.exports = app;