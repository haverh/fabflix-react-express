const bcrypt = require('bcryptjs');
const pgp = require('pg-promise')();

const db = pgp({
    connectionString: 'postgresql://myuser:My6Pa$$word@localhost:5432/moviedb',
});

const getUsersQuery = 'SELECT id, password FROM customers';

const hashPassword = async () => {
    try {
        const customers = await db.any(getUsersQuery);

        for ( const customer of customers ) {
            const plainTextPassword = customer.password;
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(plainTextPassword, salt);

            await db.none('UPDATE customers SET phash = $1 WHERE id = $2', [hashedPassword, customer.id]);
            console.log(`Password updated for user with ID ${customer.id}`);
        }
        console.log('All passwords have been hashed and updated.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pgp.end(); // Close the database connection
    }
}

hashPassword();