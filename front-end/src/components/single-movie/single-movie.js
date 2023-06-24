import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import './single-movie.css'

function SingleMovie() {

    const omdbAPI = "f6cd5e6f";
    
    const [movieInfo, setMovieInfo] = useState({});
    const [moviePoster, setMoviePoster] = useState({});

    const urlParams = new URLSearchParams(useLocation().search);

    useEffect(() => {
        fetchData(urlParams.get('movieId'));
        fetchPoster(urlParams.get('movieId'));
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
    const fetchPoster = async (movieId) => {
        try {

            const response = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=${omdbAPI}`);
            const jsonData = await response.json();
            // console.log(jsonData)
            setMoviePoster(jsonData.Poster);
          } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return (
        <div className="page-content">
            <h1>{movieInfo.movieTitle} ({movieInfo.movieYear})</h1>
            <div className="table-img">
                <table className="table table-striped">
                    <tbody>
                        <tr>
                            <th scope="row" >Director</th>
                            <td>{movieInfo.movieDirector} </td>
                        </tr>
                        <tr>
                            <th scope="row" >Genres</th>
                            <td>
                                {movieInfo.movieGenres && movieInfo.movieGenres.map((gObj, gIndex) => (
                                <React.Fragment key={gIndex}>
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
                                <React.Fragment key={sIndex}>
                                    <Link to="#" className="link">{sObj.starName}</Link>
                                    {sIndex < movieInfo.movieStars.length - 1 && ', '}
                                </React.Fragment>
                                ))}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <img className="image" src={moviePoster}></img>
            </div>
        </div>
    )
}


export default SingleMovie;