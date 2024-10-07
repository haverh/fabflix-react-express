/* eslint-disable no-throw-literal */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './top-movies.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../../contexts/CartContext';
import posterPlaceholder  from '../../img/img-placeholder.png';

import Loading from '../loading/loading';

import fetchURL from '../../config';


const TopMovies = () => {
  const omdbAPI = "f6cd5e6f";

  const cart = useContext(CartContext);

  const [loading, setLoading] = useState(true);
  const [top, setTop] = useState([]);
  // const [OMDbInfo, setOMDbInfo] = useState({});

  // Fetch top movies and their respective poster
  const fetchData = useCallback(async () => {
    console.time("fetchTime");
    setLoading(true);
    try {
      const response = await fetch(`${fetchURL}/api/topmovies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });

      const jsonData = await response.json();
      console.log("TOP",jsonData)
      

      if (!response.ok) {
        throw {
          ...jsonData,
          status: response.status,
        }
      }
      setLoading(false);
      setTop(jsonData)
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
        window.location.href = "login";
      }
    }
    console.timeEnd("fetchTime");
  }, [fetchURL]);

  useEffect(() => {
      fetchData();
  }, [fetchData]);

  return ( 
    <div className="top-movies-content w-full h-full py-[3%] px-[10%] text-center">
      <h1 className='text-[#9EC8B9] font-bold'>Top 20 Rated Movies</h1>
      <div className='flex-container w-full h-full flex-1 flex justify-center'>
        {loading ? (
          <Loading/>
        ): (<div className='movies-grid w-[250px] flex flex-wrap gap-[10px]'>
          {top.map((item) => (
            <div key={item.movieId} className='grid-item w-[250px] h-[380px] rounded-[10px] transform duration-200 ease-in-out text-[#9EC8B9] no-underline text-[0.7em] flex flex-col items-center border-t-4 border-x-4 border-[#2E4F4F] border-solid hover:scale-[1.02]'>
              <Link key={item.movieId} to={`/single-movie?movieId=${item.movieId}`} draggable='false' className='w-full'>
                {item.moviePoster !== "N/A" 
                ? <img className='poster w-full h-[250px] rounded-[10px] border border-solid border-black' src={item.moviePoster} alt="Movie Poster"></img>
                : <div className='placeholderPoster flex justify-center items-center w-full h-[250px] rounded-[10px] border border-solid border-black bg-[rgb(212, 211, 211)]'>
                    <img className='w-[150px] h-[150px]' src={posterPlaceholder} alt="Movie Poster"></img>
                  </div>}
              </Link>
              <div className='movie-info flex-1 w-full py-0 px-[5%] flex flex-col justify-evenly items-center'>
                  <h2 className='text-[2em] text-center font-bold text-[#64CCC5] cursor-text'>{item.movieTitle}</h2>
                  <h3 className='w-full text-[1.5em] flex justify-between font-normal '>
                    <span className='cursor-text'>{item.movieYear}</span>
                    <span className='moviePrice font-bold text-[#DCF2F1] cursor-text'>${item.moviePrice}</span>
                    <span className='cursor-text'>{item.movieRating}
                      <span className="fa-layers fa-fw">
                        <FontAwesomeIcon icon={faStar} color="#C5E898" size="sm"/>
                      </span>
                    </span>
                  </h3>
                </div>
              <button className='addToCart w-[200px] h-[30px] text-[#395B64] text-base font-bold border-0 rounded-[20px] bg-[#A5C9CA] m-[3px] duration-200 hover:scale-[1.05] active:scale-[0.9]' name='addToCart'
                onClick={() => cart.addOne(item.movieId, item.movieTitle, item.moviePoster)}>
                ADD TO CART
              </button>
            </div>
          ))}
        </div>
        )}
      </div>
      <div id="attribution" className='fixed w-full bg-[#f0f0f0]'>
        <a href="https://www.flaticon.com/free-icons/image" title="image icons">Image icons created by Pixel perfect - Flaticon</a>
      </div>
    </div>
)
}

export default TopMovies;