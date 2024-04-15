/* eslint-disable no-throw-literal */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, useMemo, useCallback} from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faStar } from '@fortawesome/free-solid-svg-icons';
// import { CartContext } from '../../contexts/CartContext';
// import { useAuth0 } from "@auth0/auth0-react";

import posterPlaceholder  from '../../img/img-placeholder.png';
import './movies-result.css';

import Loading from '../loading/loading';
import MovieCards from './movie-cards';

const MoviesResult = () => {
  const omdbAPI = "f6cd5e6f";

  // const { isAuthenticated, loginWithRedirect } = useAuth0();

  // const cart = useContext(CartContext);
  const [pageTitle, setPageTitle] = useState('Movies Result');
  const [loading, setLoading] = useState(true);
  const [movieData, setMovieData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResult, setTotal] = useState(-1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("rating");
  const [isExhausted, setIsExhausted] = useState(true);

  const perPage = 10;
  const numPage = 5;
  const location = useLocation()

  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const reset = () => {
    setMovieData([]);
    setTotal(-1);
    setCurrentPage(1);
    setIsExhausted(true);
  }

  // const fetchURL = process.env.REACT_APP_VERCEL_FETCH_URL;
  const fetchURL = process.env.REACT_APP_LOCAL_FETCH_URL;

  const fetchByStartChar = useCallback(async (startCharacter) => {
    console.log("FETCHING MOVIES BY CHAR")
    try {
      const params = new URLSearchParams({startCharacter, currentPage, sortOrder, sortBy, perPage, numPage});
      const response = await fetch(`${fetchURL}/api/byStartCharacter?${params}`, {
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

      if ( currentPage === 1 ) { setTotal(jsonData.total); }
      setIsExhausted(false);
      setPageTitle(`Results for "${startCharacter}"`)

      console.time("Poster Fetch Time")
      const moviePromises = jsonData.moviesList.map(async (obj) => {
          const response = await fetch(`https://www.omdbapi.com/?i=${obj.movieId}&apikey=${omdbAPI}`);
          const jsonData = await response.json();
          const plot = jsonData.Plot;
          
          // console.log(plot);
          return  {...obj, plot: plot};
      })

      const updatedMovieList = await Promise.all(moviePromises);
      setLoading(false);
      console.timeEnd("Poster Fetch Time")
      console.log(updatedMovieList)
      
      setMovieData([...movieData, ...updatedMovieList]);
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
        window.location.href = "login";
      }
    }
  }, [currentPage, fetchURL, movieData, sortBy, sortOrder]);




  const fetchByGenre = useCallback(async (genreId, genreName) => {
    console.log("FETCHING MOVIES BY GENRE")
    try {
      const params = new URLSearchParams({genreId, currentPage, sortOrder, sortBy, perPage, numPage});
      const response = await fetch(`${fetchURL}/api/byGenre?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });
      const jsonData = await response.json();
      console.log(jsonData);

      if (!response.ok) {
        throw {
          ...jsonData,
          status: response.status,
        }
      }
      
      if ( currentPage === 1 ) { setTotal(jsonData.total); }
      setIsExhausted(false);
      setPageTitle(`Results for "${genreName}" Genre`)

      console.time("Poster Fetch Time")
      const moviePromises = jsonData.moviesList.map(async (obj) => {
          const response = await fetch(`https://www.omdbapi.com/?i=${obj.movieId}&apikey=${omdbAPI}`);
          const jsonData = await response.json();
          const plot = jsonData.Plot;
          
          // console.log(plot);
          return  {...obj, plot: plot};
      })

      const updatedMovieList = await Promise.all(moviePromises);
      setLoading(false);
      console.timeEnd("Poster Fetch Time")
      console.log(updatedMovieList)
      
      setMovieData([...movieData, ...updatedMovieList]);
      // setMovieData([...movieData, ...jsonData.moviesList])
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
        window.location.href = "login";
      }
    }
  }, [currentPage, fetchURL, movieData, sortBy, sortOrder]);




  const fetchByTitle = useCallback(async (title) => {
    console.log("FETCHING MOVIES BY CHAR")
    try {
      const params = new URLSearchParams({title, currentPage, sortOrder, sortBy, perPage, numPage});
      const response = await fetch(`${fetchURL}/api/title?${params}`, {
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

      if ( currentPage === 1 ) { setTotal(jsonData.total); }
      setIsExhausted(false);
      setPageTitle(`Results for "${title}"`)

      console.time("Poster Fetch Time")
      const moviePromises = jsonData.moviesList.map(async (obj) => {
          const response = await fetch(`https://www.omdbapi.com/?i=${obj.movieId}&apikey=${omdbAPI}`);
          const jsonData = await response.json();
          const plot = jsonData.Plot;
          
          // console.log(plot);
          return  {...obj, plot: plot};
      })

      const updatedMovieList = await Promise.all(moviePromises);
      setLoading(false);
      console.timeEnd("Poster Fetch Time")
      console.log(updatedMovieList)
      
      setMovieData([...movieData, ...updatedMovieList]);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
        window.location.href = "login";
      }
    }
  }, [currentPage, fetchURL, movieData, sortBy, sortOrder]);

  // Decide which endpoint to call
  const fetchDataManager = useCallback((urlParams) => {
  setLoading(true);
    if (urlParams.get('startCharacter')) {
      fetchByStartChar(urlParams.get('startCharacter'));
    } else if (urlParams.get('genreId')) {
      fetchByGenre(Number(urlParams.get('genreId')), urlParams.get('genreName'));
    } else if (urlParams.get('title')) {
      fetchByTitle(urlParams.get('title'));
    }
  }, [fetchByStartChar, fetchByGenre, fetchByTitle]);

  const changeSortOrder = () => {
    if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder("asc");
    }
    reset();
  };

  const prevButtonEvent = () => {
    setCurrentPage(current => (currentPage > 1 ? current - 1 : current))
    window.scrollTo(0, 0)
  };

  const nextButtonEvent = () => {
    setCurrentPage((current) => current + 1)
    setIsExhausted(currentPage % 5 === 4);
    window.scrollTo(0, 0)

  };

  useEffect(() => {
    reset();
  }, [urlParams])

  useEffect(() => {
  if ( isExhausted && (movieData.length !== totalResult)) {
    fetchDataManager(urlParams);
  }
  }, [urlParams, sortOrder, sortBy, isExhausted]);

return (
  <div className="results-content w-full h-full py-[3%] px-[5%] flex flex-col sm:py-[3%] sm:px-[10%] md:py-[3%] md:px-[15%] lg:py-[3%] lg:px-[20%]">
    <h1 className='font-bold'>{pageTitle}</h1>
    <div style={{display:"flex", justifyContent: "end", gap: "1%"}}>
      <label className='font-bold' defaultValue={sortBy} onChange={ (e) => {setSortBy(e.target.value); reset();} } htmlFor="sortby">Sort By: 
        <select className='h-[30px] w-[100px] bg-[#4FBDBA] text-[#313030] font-bold text-center my-0 mx-[5px]' name="sortby" id="sortby">
          <option value="rating">Rating</option>
          <option value="title">Title</option>
          <option value="year">Release</option>
          <option value="director">Director</option>
        </select> 
      </label>
      <button className="sortOrderBtn bg-[#4FBDBA] h-[30px] w-[30px] rounded-[5px] flex justify-center items-center border-0" onClick={changeSortOrder}>
        <FontAwesomeIcon icon={faSort} rotatation={0} style={{color: "#313030", }} />
      </button>
    </div>
    {loading ? (
      <Loading/>
      ):
      (<MovieCards
        movieData={movieData}
        currentPage={currentPage}
        perPage={perPage}
      />
    )}
    <div className='paginationButtons my-[10px] flex justify-center items-center gap-[10%]'>
      <button
        className={currentPage === 1 ? 'disabled-btn' : 'enabled-btn'}
        onClick={prevButtonEvent} 
        disabled={currentPage === 1}
        >&lt;Prev
      </button>
      <span className='bg-[#f0f0f0] text-black w-fit h-fit py-[2px] px-[5px] border border-solid rounded-[5px] text-center font-bold'>{currentPage}</span>
      <button 
        className={Math.ceil(totalResult/perPage - 1) + 1 === currentPage ? 'disabled-btn' : 'enabled-btn'}
        onClick={nextButtonEvent} 
        disabled={Math.ceil(totalResult/perPage - 1) + 1 === currentPage}
        >Next&gt;
      </button>
    </div>
  </div>
  )
};

export default MoviesResult;