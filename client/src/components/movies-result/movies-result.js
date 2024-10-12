/* eslint-disable no-throw-literal */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, useMemo, useCallback} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownShortWide, faArrowUpShortWide } from '@fortawesome/free-solid-svg-icons';

import Pagination from '../pagination/pagination';
import fetchURL from '../../config';

import posterPlaceholder  from '../../img/img-placeholder.png';
import './movies-result.css';

import Loading from '../loading/loading';
import MovieCards from './movie-cards';

const MoviesResult = () => {
  const navigate = useNavigate();
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
      
      setMovieData([...movieData, ...jsonData.moviesList])
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
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
      
      setMovieData([...movieData, ...jsonData.moviesList])
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
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
      
      setMovieData([...movieData, ...jsonData.moviesList]);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
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
  <div className="results-content py-4 px-6 flex flex-col ">
    <h1 className='font-bold text-center'>{pageTitle}</h1>
    <div className='flex justify-center'>
      <div className='max-w-[600px] w-full flex justify-end gap-1'>
        <label className='font-bold' defaultValue={sortBy} onChange={ (e) => {setSortBy(e.target.value); reset();} } htmlFor="sortby">Sort By: 
          <select className='h-[30px] w-[100px] bg-[#4FBDBA] text-[#313030] font-bold text-center my-0 mx-[5px]' name="sortby" id="sortby">
            <option value="rating">Rating</option>
            <option value="title">Title</option>
            <option value="year">Release</option>
            <option value="director">Director</option>
          </select> 
        </label>
        <button className="sortOrderBtn bg-[#4FBDBA] h-[30px] w-[30px] rounded-[5px] flex justify-center items-center border-0" onClick={changeSortOrder}>
          {sortOrder === 'asc' 
          ? <FontAwesomeIcon icon={faArrowDownShortWide} rotatation={0} style={{color: "#313030", }} /> 
          : <FontAwesomeIcon icon={faArrowUpShortWide} rotatation={0} style={{color: "#313030", }} />}
        </button>
      </div>
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
    <Pagination currentPage={currentPage} totalResult={totalResult} perPage={perPage} prevButtonEvent={prevButtonEvent} nextButtonEvent={nextButtonEvent} />
    
  </div>
  )
};

export default MoviesResult;