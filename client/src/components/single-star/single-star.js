/* eslint-disable no-throw-literal */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './single-star.css';
import MovieCards from '../movies-result/movie-cards';
import Loading from '../loading/loading';

import fetchURL from '../../config';

const SingleStar = () => {
  const omdbAPI = "f6cd5e6f";

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [starInfo, setStarInfo] = useState({});
  const location = useLocation()

  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  

  const fetchData = useCallback(async (starId) => {
    console.log("FETCHING STAR INFO")
    try {

      const response = await fetch(`${fetchURL}/api/single-star?starId=${starId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });
      const jsonData = await response.json();

      if (!response.ok) {
        throw {
          ...jsonData,
          status: response.status,
        }
      }

      console.time("Poster Fetch Time")
      const moviePromises = jsonData.starMoviesList.map(async (movieObj) => {
          const response = await fetch(`https://www.omdbapi.com/?i=${movieObj.movieId}&apikey=${omdbAPI}`);
          const jsonData = await response.json();
          const plot = jsonData.Plot;
          return  {...movieObj, plot: plot};
      })

      const updatedMovieList = await Promise.all(moviePromises);
      setStarInfo({...jsonData, starMoviesList: updatedMovieList});

    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [fetchURL]);

  useEffect(() => {
    fetchData(urlParams.get('starId'));
  },[urlParams, fetchData])


  
  return ( 
    loading ? <Loading /> :
    <div className="single-star-content">
      <h1 className='font-bold text-center'>{starInfo.starName} ({starInfo.starBirth || 'N/A'})</h1>
      {starInfo.starMoviesList && <MovieCards movieData={starInfo?.starMoviesList} currentPage={1} perPage={starInfo.starMoviesList.length} />}
    </div>
  )
}


export default SingleStar;