/* eslint-disable no-throw-literal */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import Loading from '../loading/loading';
import posterPlaceholder  from '../../img/img-placeholder.png';
import './single-movie.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import {AddToCartBig, AddToCartSmall} from '../shopping-cart/add-to-cart';

import fetchURL from '../../config';

function SingleMovie() {

  const navigate = useNavigate();

  const omdbAPI = "f6cd5e6f";
  
  const [loading, setLoading] = useState(true);
  const [movieInfo, setMovieInfo] = useState(null);
  const [OMDbInfo, setOMDbInfo] = useState(null);

  const location = useLocation()

  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // Fetch movie data from backend
  const fetchData = useCallback(async (movieId) => {
    console.log("FETCHING MOVIE INFO")
    try {
      // Fetch movie data
      const movieResponse = await fetch(`${fetchURL}/api/single-movie?movieId=${movieId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });
      const movieData = await movieResponse.json();

      console.log(movieData)

      if (!movieResponse.ok) {
        throw {
          ...movieData,
          status: movieResponse.status,
        }
      }

      // Fetch movie price
      const priceResponse = await fetch(`${fetchURL}/api/cart/price?movieId=${movieId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });
      const priceData = await priceResponse.json();

      console.log(priceData)

      if (!priceResponse.ok) {
        throw {
          ...priceData,
          status: priceResponse.status,
        }
      }


      // console.log(jsonData)
      setMovieInfo({...movieData, moviePrice: priceData.price});
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
        navigate("/login");
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
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(urlParams.get('movieId'));
    fetchOMDb(urlParams.get('movieId'));
  }, [urlParams, fetchData])


  if (loading) {
    return <Loading />
  }
  
  if (movieInfo) {
    return ( 
      <div className="single-movie-content py-[3%] px-[15%] flex flex-col justify-center items-center md:flex-row md:gap-[50px]">
        <div className='max-w-[1000px] flex flex-col justify-center items-center md:flex-row md:gap-[50px]'>
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

            <hr/>

            <div id='movie-price-container-small'>
              <p className='moviePrice'>$ {movieInfo.moviePrice}</p>
              <AddToCartBig movieid={movieInfo.movieId} movietitle={movieInfo.movieTitle} movieposter={movieInfo.moviePoster} />
            </div>
          </div>

          <div className='movieMainInfo'>
            <div id='movie-price-container-large'>
              <p className='moviePrice'>$ {movieInfo.moviePrice}</p>
              <AddToCartBig movieid={movieInfo.movieId} movietitle={movieInfo.movieTitle} movieposter={movieInfo.moviePoster} />
            </div>
            <hr/>
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
      </div>
    )
  }

  
}
export default SingleMovie;