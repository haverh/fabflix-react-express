const pgp = require('pg-promise')();

const db = pgp({
    connectionString: 'postgresql://myuser:My6Pa$$word@localhost:5432/moviedb',
});
const omdbAPI = "f6cd5e6f";

// 0 -> 500 -> 1000 -> etc
const getUsersQuery = 'SELECT id FROM movies ORDER BY id ASC LIMIT 500 OFFSET 9000';

// db.any(getUsersQuery).then(
//     async (data) => {
//         const moviePromises = data.map(async (movie) => {
//             const response = await fetch(`https://www.omdbapi.com/?i=${movie.id}&apikey=${omdbAPI}`);
//             const jsonData = await response.json();
//             const poster = jsonData.Poster;

//             console.log("GOT HERE")
//             console.log(movie.id)

//             const updateQuery = `
//                     UPDATE movies
//                     SET poster = $1
//                     WHERE id = $2
//                 `;

//             console.log("GOT HERE 2")
//             await db.none(updateQuery, [poster, movie.id]);
//             console.log("GOT HERE 3")
//             const updatedMovieList = await Promise.all(moviePromises);
//             console.log('Movie posters updated successfully:', updatedMovieList);
//         })
//     }
// ).catch((error) => {
//     console.error('Error:', error);
// })
// .finally(() => {
//     // Close the database connection
//     pgp.end();
// });

(async () => {
    try {
        const data = await db.any(getUsersQuery);

        const moviePromises = data.map(async (movie) => {
            try {
                const response = await fetch(`https://www.omdbapi.com/?i=${movie.id}&apikey=${omdbAPI}`);
                const jsonData = await response.json();

                if (jsonData.Response === 'True') {
                    const poster = jsonData.Poster !== 'N/A' ? jsonData.Poster : 'N/A';
                    return { id: movie.id, poster: poster };
                } else {
                    console.error(`OMDb API error for movie ID ${movie.id}: ${jsonData.Error}`);
                    return null;
                }
            } catch (apiError) {
                console.error(`Error fetching data for movie ID ${movie.id}:`, apiError.message);
                return null;
            }
        });

        const updatedMovieList = (await Promise.all(moviePromises)).filter(Boolean);

        // After fetching posters, update the database with the new poster URLs
        const updatePromises = updatedMovieList.map(async (movie) => {
            const updateQuery = `
                UPDATE movies
                SET poster = $1
                WHERE id = $2
            `;
            await db.none(updateQuery, [movie.poster, movie.id]);
        });

        await Promise.all(updatePromises);

        console.log('Movie posters updated successfully:', updatedMovieList);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the database connection
        pgp.end();
    }
})();