/* eslint-disable no-throw-literal */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faStar } from '@fortawesome/free-solid-svg-icons';
// import { CartContext } from '../../contexts/CartContext';
// import { useAuth0 } from "@auth0/auth0-react";

import posterPlaceholder  from '../../img/img-placeholder.png';
import './movies-result.css';

const MoviesResult = () => {
    const omdbAPI = "f6cd5e6f";

    // const { isAuthenticated, loginWithRedirect } = useAuth0();

    // const cart = useContext(CartContext);
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

            // const topPromises = jsonData.moviesList.map(async (obj) => {
            //     const response = await fetch(`https://www.omdbapi.com/?i=${obj.movieId}&apikey=${omdbAPI}`);
            //     const jsonData = await response.json();
            //     const poster = jsonData.Poster !== "N/A" ? jsonData.Poster : posterPlaceholder;
            //     return  {...obj, moviePoster:poster};
            // })

            // const updatedMovieList = await Promise.all(topPromises);
            // console.log(updatedMovieList)

            // setMovieData([...movieData, ...updatedMovieList]);
            setMovieData([...movieData, ...jsonData.moviesList]);
          } catch (error) {
            console.error('Error fetching data:', error);
            if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
                window.location.href = "login";
            }
        }
    }, [currentPage, fetchURL, movieData, sortBy, sortOrder]);

    const fetchByGenre = useCallback(async (genreId) => {
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

            // console.time("Poster Fetch Time")
            // const moviePromises = jsonData.moviesList.map(async (obj) => {
            //     const response = await fetch(`https://www.omdbapi.com/?i=${obj.movieId}&apikey=${omdbAPI}`);
            //     const jsonData = await response.json();
            //     const poster = jsonData.Poster !== "N/A" ? jsonData.Poster : posterPlaceholder;
            //     return  {...obj, moviePoster:poster};
            // })

            // const updatedMovieList = await Promise.all(moviePromises);
            // console.timeEnd("Poster Fetch Time")
            // console.log(updatedMovieList)
            
            // setMovieData([...movieData, ...updatedMovieList]);
            setMovieData([...movieData, ...jsonData.moviesList])
          } catch (error) {
            console.error('Error fetching data:', error);
            if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
                window.location.href = "login";
            }
        }
    }, [currentPage, fetchURL, movieData, sortBy, sortOrder]);

    // Decide which endpoint to call
    const fetchDataManager = useCallback((urlParams) => {
        if (urlParams.get('startCharacter')) {
            fetchByStartChar(urlParams.get('startCharacter'));
        } else if (urlParams.get('genreId')) {
            fetchByGenre(Number(urlParams.get('genreId')));
        }
    }, [fetchByStartChar, fetchByGenre]);

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
            <h1>Movie Results</h1>
            <div style={{display:"flex", justifyContent: "end", gap: "1%"}}>
                <label className='font-bold' defaultValue={sortBy} onChange={ (e) => {setSortBy(e.target.value); reset();} } htmlFor="sortby">Sort By: 
                <select className='h-[30px] w-[100px] text-[rgb(0, 123, 255)] font-bold text-center my-0 mx-[5px]' name="sortby" id="sortby">
                    <option value="rating">Rating</option>
                    <option value="title">Title</option>
                    <option value="year">Release</option>
                    <option value="director">Director</option>
                </select> 
                </label>
                <button className="sortOrderBtn h-[30px] w-[30px] rounded-[5px] flex justify-center items-center border-0" onClick={changeSortOrder}>
                    <FontAwesomeIcon icon={faSort} rotatation={0} style={{color: "#007bff", }} />
                </button>
            </div>
            <div className='card-container w-full h-auto'>
                {movieData.slice((currentPage - 1) * perPage, (currentPage - 1) * perPage + 10).map((item, index) => (
                    <Link to={`/single-movie?movieId=${item.movieId}`} key={item.movieId}
                        className='movie-card w-full border-2 border-solid border-white rounded-[10px] my-[10px] mx-[1px] p-[1px] flex no-underline text-[aliceblue] hover:border-[rgb(37, 199, 199)]'>
                        {item.moviePoster !== "N/A" 
                        ? <div className='movie-poster-frame'>
                            <img className='movie-poster w-full rounded-[10px] sm:w-[150px] sm:h-[200px] md:w-[170px] md:h-[230px]' src={item.moviePoster} alt="Movie Poster"></img>
                          </div>
                        : <div className='movie-poster-frame'>
                            <img className='movie-placeholder w-[90px] my-0 mx-[5px] rounded-[10px] sm:w-[150px] sm:h-[200px] md:w-[170px] md:h-[230px]' src={posterPlaceholder} alt="Movie Poster"></img>
                          </div>}
                        <div className='result-movie-info w-full flex flex-col justify-evenly items-start p-0'>
                            <h2 className='w-full text-[1.2em] font-bold sm:text-[1.5em]'>{item.movieTitle}</h2>
                            <h3 className='year-rating w-full flex justify-between py-0 pr-[10px] pl-0'>
                                <span>{item.movieYear}</span>
                                <span className='movie-rating text-[1.2em]'>{item.movieRating}<FontAwesomeIcon icon={faStar} color="#8DBA5E" size="sm" /></span>
                            </h3>
                            <h3 className='w-full text-base'>Directed by: {item.movieDirector}</h3>
                        </div>
                    </Link>
                ))}
                
            </div>
            <div className='paginationButtons mt-[10px] flex justify-center items-center gap-[10%]'>
                <button onClick={prevButtonEvent} disabled={currentPage === 1}>Prev</button>
                <span className='bg-[#f0f0f0] text-black w-fit h-fit py-[2px] px-[5px] border border-solid rounded-[5px] text-center font-bold'>{currentPage}</span>
                <button onClick={nextButtonEvent} disabled={Math.ceil(totalResult/perPage - 1) + 1 === currentPage}>Next</button>
            </div>
        </div>
    )
};

export default MoviesResult;