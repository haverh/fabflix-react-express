-- INSERT EMPLOYEE

-- INSERT INTO employees(firstname, lastname, email, password) VALUES(
-- 	'Tessa',
-- 	'Rivers',
-- 	'real_admin@email.com',
-- 	'adminIsMe44@'
-- );

SELECT firstname, lastname, email FROM employees WHERE email='real_admin@email.com' AND password='adminIsMe44@';



SELECT column_name, data_type from information_schema.columns
WHERE table_name='movies';

SELECT table_name FROM information_schema.tables
WHERE table_schema='public'
AND table_type='BASE TABLE'
ORDER BY table_name;



