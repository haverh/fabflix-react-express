import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import './single-movie.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

function SingleMovie() {

    const omdbAPI = "f6cd5e6f";
    
    const [movieInfo, setMovieInfo] = useState({});
    const [OMDbInfo, setOMDbInfo] = useState({});

    const urlParams = new URLSearchParams(useLocation().search);

    useEffect(() => {
        fetchData(urlParams.get('movieId'));
        fetchOMDb(urlParams.get('movieId'));
    }, [])

    // Fetch movie data from backend
    const fetchData = async (movieId) => {
        try {

            const response = await fetch(`http://localhost:5000/api/single-movie?movieId=${movieId}`);
            const jsonData = await response.json();
            // console.log(jsonData)
            setMovieInfo(jsonData);
          } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Fetch movie poster from OMDd using API call
    const fetchOMDb = async (movieId) => {
        try {

            const response = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=${omdbAPI}`);
            const jsonData = await response.json();
            // console.log(jsonData)
            let OMDbMovieInfo = {}
            OMDbMovieInfo.plot = jsonData.Plot
            OMDbMovieInfo.poster = jsonData.Poster
            setOMDbInfo(OMDbMovieInfo);
          } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return (
        <div className="page-content">
            <h1 className="header">
                <span className="movieTitle">{movieInfo.movieTitle} ({movieInfo.movieYear})</span>
                <span className="movieRating">{movieInfo.movieRating} 
                    <span className="fa-layers fa-fw">
                        <FontAwesomeIcon icon={faStar} color="#8DBA5E" size="sm" transform="shrink-6"/>
                        <FontAwesomeIcon icon={farStar} size="sm" />
                    </span>
                </span>
            </h1>
            <div className="table-img">
                <table className="table table-striped">
                    <tbody>
                        <tr>
                            <th scope="row" >Plot</th>
                            <td>{OMDbInfo.plot} </td>
                        </tr>
                        <tr>
                            <th scope="row" >Director</th>
                            <td>{movieInfo.movieDirector} </td>
                        </tr>
                        <tr>
                            <th scope="row" >Genres</th>
                            <td>
                                {movieInfo.movieGenres && movieInfo.movieGenres.map((gObj, gIndex) => (
                                <React.Fragment key={gObj.genreId}>
                                    <Link to="#" className="link">{gObj.genreName}</Link>
                                    {gIndex < movieInfo.movieGenres.length - 1 && ', '}
                                </React.Fragment>
                                ))}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" >Stars</th>
                            <td>
                                {movieInfo.movieStars && movieInfo.movieStars.map((sObj, sIndex) => (
                                <React.Fragment key={sObj.starId}>
                                    <Link to={`/single-star?starId=${sObj.starId}`} className="link">{sObj.starName}</Link>
                                    {sIndex < movieInfo.movieStars.length - 1 && ', '}
                                </React.Fragment>
                                ))}
                            </td>
                        </tr>
                    </tbody>
                </table>
                {OMDbInfo.poster !== 'N/A' && <img className="image" src={OMDbInfo.poster} alt="Movie Poster"></img>}
            </div>
        </div>
    )
}


export default SingleMovie;