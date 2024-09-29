-- ADD DELETE CONSTRAINT TO star_in_movies
ALTER TABLE stars_in_movies
DROP CONSTRAINT stars_in_movies_movieid_fkey;

ALTER TABLE stars_in_movies
ADD CONSTRAINT on_delete_starId
FOREIGN KEY (starId)
REFERENCES stars(id)
ON DELETE CASCADE;

ALTER TABLE stars_in_movies
ADD CONSTRAINT on_delete_movieId
FOREIGN KEY (movieId)
REFERENCES movies(id)
ON DELETE CASCADE;

ALTER TABLE stars_in_movies
ADD CONSTRAINT unique_star_movie UNIQUE (movieid, starid);

-- ADD DELETE CONSTRAINT TO genres_in_movies
ALTER TABLE genres_in_movies
DROP CONSTRAINT genres_in_movies_movieid_fkey;

ALTER TABLE genres_in_movies
ADD CONSTRAINT on_delete_genreId
FOREIGN KEY (genreId)
REFERENCES genres(id)
ON DELETE CASCADE;

ALTER TABLE genres_in_movies
ADD CONSTRAINT on_delete_movieId
FOREIGN KEY (movieId)
REFERENCES movies(id)
ON DELETE CASCADE;

ALTER TABLE genres_in_movies
ADD CONSTRAINT unique_genre_movie UNIQUE (movieid, genreid);

-- ADD DELETE CONSTRAINT TO ratings
ALTER TABLE ratings
DROP CONSTRAINT ratings_movieid_fkey;

ALTER TABLE ratings
ADD CONSTRAINT on_delete_movieId
FOREIGN KEY (movieId)
REFERENCES movies(id)
ON DELETE CASCADE;

-- ADD DELETE CONSTRAINT TO movie_prices
ALTER TABLE movie_prices
DROP CONSTRAINT movie_prices_movieid_fkey;

ALTER TABLE movie_prices
ADD CONSTRAINT on_delete_movieId
FOREIGN KEY (movieId)
REFERENCES movies(id)
ON DELETE CASCADE;




select * from new_sales;




