CREATE TABLE new_sales(
	id SERIAL PRIMARY KEY,
	email VARCHAR(50) NOT NULL,
	saledate DATE NOT NULL,
	total NUMERIC(10,2) NOT NULL,
	tax NUMERIC(10,2) NOT NULL,
	grandtotal NUMERIC(10,2) NOT NULL
);

CREATE TABLE new_sales_items(
	saleid INTEGER REFERENCES new_sales(id),
	movieid VARCHAR(10) REFERENCES movies(id),
	quantity INTEGER NOT NULL,
	unitprice NUMERIC(10,2) NOT NULL,
	totalprice NUMERIC(10,2) NOT NULL,
	PRIMARY KEY (saleid, movieid)
);