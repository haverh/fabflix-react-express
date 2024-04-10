	-- select * from stars;

-- DROP TABLE IF EXISTS nextIDs;

-- CREATE TABLE IF NOT EXISTS nextIDs(
-- 	fieldName text,
-- 	fieldId numeric
-- );
-- GRANT SELECT, INSERT, UPDATE, DELETE ON nextIDs TO myuser;



-- insert into nextIDs(fieldname, fieldid)
-- select 'star', CAST(SUBSTRING(id, 3) AS numeric) + 1
-- from stars order by id desc limit 1;

-- insert into nextIDs(fieldname, fieldid)
-- select 'genre', max(id) from genres;

-- select * from nextIDs;

-- DROP FUNCTION add_movie(character varying,character varying,integer,character varying,text,real,integer)
-- ADD MOVIE
CREATE OR REPLACE FUNCTION add_movie( _movieId varchar(10), _movieTitle varchar(100), _movieYear integer, _movieDirector varchar(100), _moviePoster text, _movieRating real, _movieNumVotes integer)
RETURNS TABLE(success BOOLEAN, message VARCHAR(255)) AS $$
DECLARE
	_success BOOLEAN;
	_message VARCHAR(255);
BEGIN
	IF EXISTS(SELECT * FROM MOVIES WHERE id=_movieId) THEN
		_success:= FALSE;
		_message:= ''''||_movieTitle||''' with ID '''||_movieId||''' already exists.';
	ELSE
		INSERT INTO movies(id, title, year, director, poster) 
		VALUES(_movieId, _movieTitle, _movieYear, _movieDirector, _moviePoster);
		INSERT INTO movie_prices(movieid, price)
		VALUES(_movieId, CAST(RANDOM() * 10 + 5 AS NUMERIC(10,2)));
		_success:= TRUE;
		_message:= 'Successfully added '''||_movieTitle||''' with ID '''||_movieId||'''.';
	END IF;

	IF NOT EXISTS(SELECT * FROM ratings WHERE movieid=_movieId) THEN
		INSERT INTO ratings(movieid, rating, numvotes)
		VALUES(_movieId, _movieRating, _movieNumVotes);
	END IF;
	RETURN QUERY SELECT _success AS success, _message AS message;
END;
$$
LANGUAGE plpgsql;


-- DROP FUNCTION add_star_to_movie(character varying,integer,character varying)
-- ADD STAR
CREATE OR REPLACE FUNCTION add_star_to_movie(_starName varchar(100), _starYear integer, _movieId varchar(10))
RETURNS TABLE(sucess BOOLEAN, message VARCHAR(255)) AS $$
DECLARE
	_success BOOLEAN;
	_message VARCHAR(255);
	_starId VARCHAR(10);
BEGIN
	SELECT * INTO _starId FROM stars WHERE name=_starName AND birthyear=_starYear;

-- 	Star doesn't exists in database
	IF _starId IS NULL THEN
		_starId:= (select 'nm' || LPAD(CAST(fieldid AS text), 7, '0') from nextIDs where fieldname='star');
		UPDATE nextIDs SET fieldid = (SELECT fieldid+1 FROM nextIDs WHERE fieldname='star') WHERE fieldname='star';
		INSERT INTO stars(id, name, birthyear)
		VALUES(_starId, _starName, _starYear);
		_success:= TRUE;
		_message:= 'Successfully added '||_starName||'('||_starYear||')'||' with ID '''||_starId ||'''.';
	ELSE
		_success:= FALSE;
		_message:= _starName||' ('||_starYear||')'||' with ID '''||_starId||''' already exists.';
	END IF;
	
	INSERT INTO stars_in_movies(starid, movieid)
	VALUES(_starId, _movieId)
	ON CONFLICT (starid,movieid) DO NOTHING;
	
	RETURN QUERY SELECT _success AS success, _message AS message;
END;
$$
LANGUAGE plpgsql;


-- DROP FUNCTION add_genre_to_movie(character varying,character varying)
-- ADD GENRE
CREATE OR REPLACE FUNCTION add_genre_to_movie(_genreName VARCHAR(32), _movieId varchar(10))
RETURNS TABLE(success BOOLEAN, message VARCHAR(255)) AS $$
DECLARE
	_success BOOLEAN;
	_message VARCHAR(255);
	_genreId VARCHAR(10);
BEGIN
	SELECT * INTO _genreId FROM genres WHERE name=_genreName;

-- 	Star doesn't exists in database
	IF _genreId IS NULL THEN
		_genreId:= (select fieldid from nextIDs where fieldname='genre');
		UPDATE nextIDs SET fieldid = (SELECT fieldid+1 FROM nextIDs WHERE fieldname='genre') WHERE fieldname='genre';
		INSERT INTO genres(id, name)
		VALUES(_genreId, _genreName);
		_success:= TRUE;
		_message:= 'Successfully added the '''||_genreName||''' genre with ID ''' || _genreId || '''.';
	ELSE
		_success:= FALSE;
		_message:= 'The '''||_genreName||''' genre with ID ''' || _genreId || ''' already exists.';
	END IF;
	
	INSERT INTO genres_in_movies(genreid, movieid)
	VALUES(CAST(_genreId as integer), _movieId)
	ON CONFLICT (genreid,movieid) DO NOTHING;
	
	RETURN QUERY SELECT _success AS success, _message AS message;
END;
$$
LANGUAGE plpgsql;

-- select * from genres_in_movies;

-- select 'nm' || LPAD(CAST(fieldid AS text), 7, '0') from nextIDs where fieldname='star';


-- UPDATE nextIDs SET fieldid = (SELECT fieldid+1 FROM nextIDs WHERE fieldname='star') WHERE fieldname='star';
-- UPDATE nextIDs SET fieldid = (SELECT fieldid+1 FROM nextIDs WHERE fieldname='genre') WHERE fieldname='genre';
-- select * from nextIDs;
