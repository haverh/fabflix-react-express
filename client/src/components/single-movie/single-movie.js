/* eslint-disable no-throw-literal */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// import { useAuth0 } from "@auth0/auth0-react";
import Loading from '../loading/loading';
import posterPlaceholder  from '../../img/img-placeholder.png';
import './single-movie.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

function SingleMovie() {

  // const { isAuthenticated, loginWithRedirect } = useAuth0();

  const omdbAPI = "f6cd5e6f";
  
  const [loading, setLoading] = useState(true);
  const [movieInfo, setMovieInfo] = useState({});
  const [OMDbInfo, setOMDbInfo] = useState({});

  const location = useLocation()

  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const fetchURL = process.env.REACT_APP_VERCEL_FETCH_URL;
  // const fetchURL = process.env.REACT_APP_LOCAL_FETCH_URL;

  // Fetch movie data from backend
  const fetchData = useCallback(async (movieId) => {
    console.log("FETCHING MOVIE INFO")
    try {
      const response = await fetch(`${fetchURL}/api/single-movie?movieId=${movieId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });
      const jsonData = await response.json();
      console.log(jsonData)

      if (!response.ok) {
        throw {
          ...jsonData,
          status: response.status,
        }
      }
      // console.log(jsonData)
      setMovieInfo(jsonData);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
        window.location.href = "login";
      }
    }
  }, [fetchURL])

  // Fetch movie poster from OMDd using API call
  const fetchOMDb = async (movieId) => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${omdbAPI}`);
      const jsonData = await response.json();
      console.log(jsonData)
      let OMDbMovieInfo = {
        plot: jsonData.Plot,
        runtime: jsonData.Runtime,
        rated: jsonData.Rated,
      }
      console.log(OMDbMovieInfo)
      setOMDbInfo(OMDbMovieInfo);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchData(urlParams.get('movieId'));
    fetchOMDb(urlParams.get('movieId'));
  }, [urlParams, fetchData])

  return ( 
    loading ? <Loading /> :
    <div className="single-movie-content my-[3%] mx-[15%] flex flex-col justify-center items-center md:flex-row md:gap-[50px]">
      <div className='poster-subinfo'>
        <div className="poster-title flex flex-col justify-between items-center md:flex-col md:justify-center md:items-center">
          <h1 className="movieTitle text-left text-[1.5em] font-bold">{movieInfo.movieTitle} ({movieInfo.movieYear})</h1>
          {movieInfo.moviePoster !== "N/A" 
          ? <div className='single-movie-poster-frame'>
            <img className='single-movie-poster w-[250px] h-[330px] rounded-[10px]' src={movieInfo.moviePoster} alt="Movie Poster"></img>
          </div>
          : <div className='single-movie-poster-frame'>
            <img className='single-movie-placeholder w-[150px]' src={posterPlaceholder} alt="Movie Poster"></img>
          </div>}
        </div>
        <hr/>
        <div className='movieSubInfo flex flex-col'>
          <div className="movieRating"><span className='detail-title'>Rating</span> {movieInfo.movieRating} 
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon icon={faStar} color="#8DBA5E" size="sm" transform="shrink-6"/>
              <FontAwesomeIcon icon={farStar} size="sm" />
            </span>
          </div>
          <div><span className='detail-title'>Runtime</span> {OMDbInfo.runtime} </div>
          <div><span className='detail-title'>Rated</span> {OMDbInfo.rated} </div>
        </div>
      </div>

      <div className='movieMainInfo'>
        <p>{OMDbInfo.plot}</p>
        <hr/>
        <div><span className='detail-title'>Director</span> {movieInfo.movieDirector}</div>
        <hr/>

        <div>
          <span className='detail-title'>Genres</span> {movieInfo.movieGenres && movieInfo.movieGenres.map((gObj, gIndex) => (
            <React.Fragment key={gObj.genreId}>
              <Link to={`/movies?genreId=${gObj.genreId}&genreName=${gObj.genreName}`} className="link no-underline text-[#56b3b4] hover:underline">{gObj.genreName}</Link>
              {gIndex < movieInfo.movieGenres.length - 1 && ', '}
            </React.Fragment>
          ))}
          </div>
          <hr/>
          <div>
          <span className='detail-title'>Stars</span> {movieInfo.movieStars && movieInfo.movieStars.map((sObj, sIndex) => (
            <React.Fragment key={sObj.starId}>
              <Link to={`/single-star?starId=${sObj.starId}`} className="link">{sObj.starName}</Link>
              {sIndex < movieInfo.movieStars.length - 1 && ', '}
            </React.Fragment>
          ))}
          </div>
      </div>
    </div>
  )
}


export default SingleMovie;