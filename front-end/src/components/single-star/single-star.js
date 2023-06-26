import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function SingleStar() {

    const [movieList, setMovieList] = useState([]);

    const urlParams = new URLSearchParams(useLocation().search);

    useEffect(() => {
        fetchData(urlParams.get('starId'));
    })

    const fetchData = async (starId) => {
        try {

            const response = await fetch(`http://localhost:5000/api/single-star?starId=${starId}`);
            const jsonData = await response.json();
            // console.log(jsonData)
            setMovieList(jsonData);
          } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    return (
        <div className="page-content">
            <h1>StarName (Birth Year)</h1>
            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                    <th scope="col" >Title</th>
                    <th scope="col" >Release Year</th>
                    <th scope="col" >Director</th>
                    <th scope="col" >Genres</th>
                    <th scope="col" >Stars</th>
                    <th scope="col" >Rating</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Data 1</td>
                        <td>Data 2</td>
                        <td>Data 3</td>
                        <td>Data 4</td>
                        <td>Data 5</td>
                        <td>Data 6</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}


export default SingleStar;