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
    origin: [process.env.VERCEL_CLIENT_URL, process.env.LOCAL_CLIENT_URL],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
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
    // connectionString: `postgres://postgres.xuvwtdmdjkzxzfxzbalr:${process.env.SUPABASE_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`,
    // ssl: {
    //     rejectUnauthorized: false
    // }
    // ssl: {
    //     rejectUnauthorized: false,
    // },
})

// Routes
const landingRoutes = require('./routes/landing-route'); // Landing
const loginRoutes = require('./routes/login-route'); // Login
const logoutRoutes = require('./routes/logout-route'); // Logout
const homeRoutes = require('./routes/home-route'); // Home
const cartRoutes = require('./routes/cart-route'); // Cart
const checkoutRoutes = require('./routes/checkout-route'); // Checkout
const fulltextRoutes = require('./routes/fulltext-route'); // Fulltext 
const topMoviesRoutes = require('./routes/top-movies-route'); // Top Movies
const singleMovieRoutes = require('./routes/single-movie-route'); // Single Movie
const singleStarRoutes = require('./routes/single-star-route'); // Single Movie
const tokenAuthRoutes = require('./routes/token-auth');

const addMovieRoutes = require('./routes/admin/add-movie-route'); // Add Movie
const addStarRoutes = require('./routes/admin/add-star-route'); // Add Star
const addGenreRoutes = require('./routes/admin/add-genre-route'); // Add Genre
const dbSchemaRoute = require('./routes/admin/db-schema-route'); // Fetch Schema Data

landingRoutes(app);
loginRoutes(pool, app);
logoutRoutes(pool, app);
homeRoutes(pool, app);
cartRoutes(pool, app);
checkoutRoutes(pool, app);
fulltextRoutes(pool, app);
topMoviesRoutes(pool, app);
singleMovieRoutes(pool, app);
singleStarRoutes(pool, app);
tokenAuthRoutes(pool, app);

addMovieRoutes(pool, app);
addStarRoutes(pool, app);
addGenreRoutes(pool,app);
dbSchemaRoute(pool, app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

module.exports = app;