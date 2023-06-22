import React, {useState} from 'react';

function TopMovies() {

    const [rows, setRows] = useState([]);

    


    return (
        <table className="table table-striped">
            <thead>
                <tr>
                <th scope="col">Title</th>
                <th scope="col">Release Year</th>
                <th scope="col">Director</th>
                <th scope="col">Genres</th>
                <th scope="col">Stars</th>
                <th scope="col">Rating</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                </tr>
                <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                </tr>
                <tr>
                <th scope="row">3</th>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
                </tr>
            </tbody>
            </table>
    )
}

export default TopMovies;