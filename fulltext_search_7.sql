ALTER TABLE movies ADD COLUMN ts tsvector
    GENERATED ALWAYS AS (to_tsvector('english', title)) STORED;
	
CREATE INDEX ts_idx ON movies USING GIN (ts);