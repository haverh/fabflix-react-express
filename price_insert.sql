INSERT INTO movie_prices (movieid, price)
SELECT id, CAST(RANDOM() * 10 + 5 AS NUMERIC(10,2)) FROM movies;