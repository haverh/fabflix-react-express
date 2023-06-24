import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import './top-movies.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function TopMovies() {

    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/topmovies');
            const jsonData = await response.json();
            // console.log(jsonData)
            setRows(jsonData);
          } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    return (
        <div className="page-content">
            <h1>Top 20 Rated Movies</h1>
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
                    {rows.map((item, index) => (
                    <tr key={index}>
                        <td><Link to={`/single-movie?movieId=${item.movieId}`} className="link">{item.movieTitle}</Link></td>
                        <td>{item.movieYear}</td>
                        <td>{item.movieDirector}</td>
                        <td>
                            {item.movieGenres.map((gObj, gIndex) => (
                            <React.Fragment key={gIndex}>
                                <Link to="#" className="link">{gObj.genreName}</Link>
                                {gIndex < item.movieGenres.length - 1 && ', '}
                            </React.Fragment>
                            ))}
                        </td>
                        <td>
                            {item.movieStars.map((sObj, sIndex) => (
                            <React.Fragment key={sIndex}>
                                <Link to={`/single-star?starId=${sObj.starId}`} className="link">{sObj.starName}</Link>
                                {sIndex < item.movieStars.length - 1 && ', '}
                            </React.Fragment>
                            ))}
                        </td>
                        <td>{item.movieRating} 
                        <FontAwesomeIcon icon={faStar} color="#8DBA5E" size="sm" /></td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TopMovies;