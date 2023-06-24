// import express from 'express';
const express = require('express');
const {Pool} = require('pg');
const cors = require('cors')
// import {Pool} from 'pg';

const app = express();
const port = 5000;

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

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
  }));

topMoviesRoutes(pool, app);
singleMovieRoutes(pool, app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})