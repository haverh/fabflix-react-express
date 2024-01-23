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
        <div className="results-content">
            <h1>Movie Results</h1>
            <div style={{display:"flex", justifyContent: "end", gap: "1%"}}>
                <label defaultValue={sortBy} onChange={ (e) => {setSortBy(e.target.value); reset();} } htmlFor="sortby">Sort By: 
                <select name="sortby" id="sortby">
                    <option value="rating">Rating</option>
                    <option value="title">Title</option>
                    <option value="year">Release</option>
                    <option value="director">Director</option>
                </select> 
                </label>
                <button className="sortOrderBtn" onClick={changeSortOrder}>
                    <FontAwesomeIcon icon={faSort} rotatation={0} style={{color: "#007bff", }} />
                    {/* {(sortOrder === "asc") 
                    ? <FontAwesomeIcon icon={faSortUp} rotatation={0} style={{color: "#007bff", }} />
                    : <FontAwesomeIcon icon={faSortDown} rotatation={180} style={{color: "#007bff", }} />
                    } */}
                </button>
            </div>
            <div className='card-container'>
                {movieData.slice((currentPage - 1) * perPage, (currentPage - 1) * perPage + 10).map((item, index) => (
                    <Link to={`/single-movie?movieId=${item.movieId}`} key={item.movieId} className='movie-card'>
                        {item.moviePoster !== "N/A" 
                        ? <img className='movie-poster' src={item.moviePoster} alt="Movie Poster"></img>
                        : <img className='movie-poster' src={posterPlaceholder} alt="Movie Poster"></img>}
                        <div className='result-movie-info'>
                            <h2>{item.movieTitle}</h2>
                            <h3 className='year-rating'><span>{item.movieYear}</span><span>{item.movieRating}<FontAwesomeIcon icon={faStar} color="#8DBA5E" size="sm" /></span></h3>
                            <h3>Directed by: {item.movieDirector}</h3>
                        </div>
                    </Link>
                ))}
                
            </div>
            <div className='paginationButtons'>
                <button onClick={prevButtonEvent} disabled={currentPage === 1}>Prev</button>
                <span>{currentPage}</span>
                <button onClick={nextButtonEvent} disabled={Math.ceil(totalResult/perPage - 1) + 1 === currentPage}>Next</button>
            </div>
            {/* <h1>Movies Result</h1>
            <div style={{display:"flex", justifyContent: "end", gap: "1%"}}>
                <label defaultValue={sortBy} onChange={ (e) => {setSortBy(e.target.value); reset();} } htmlFor="sortby">Sort By: 
                <select name="sortby" id="sortby" style={{height: "27px"}}>
                    <option value="rating">Rating</option>
                    <option value="title">Title</option>
                    <option value="year">Release</option>
                    <option value="director">Director</option>
                </select> 
                </label>
                <button className="sortOrderBtn" onClick={changeSortOrder}>
                    {(sortOrder === "asc") 
                    ? <FontAwesomeIcon icon={faSortUp} rotatation={0} style={{color: "#007bff", }} />
                    : <FontAwesomeIcon icon={faSortDown} rotatation={180} style={{color: "#007bff", }} />
                    }
                </button>
            </div>
            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th></th>
                        <th scope="col" >Title</th>
                        <th scope="col" >Release Year</th>
                        <th scope="col" >Director</th>
                        <th scope="col" >Genres</th>
                        <th scope="col" >Stars</th>
                        <th scope="col" >Rating</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                {movieData.slice((currentPage - 1) * perPage, (currentPage - 1) * perPage + 10).map((item, index) => (
                    <tr key={item.movieId}>
                        <td>{(currentPage-1)*10 + index + 1}</td>
                        <td><Link to={`/single-movie?movieId=${item.movieId}`} className="link">{item.movieTitle}</Link></td>
                        <td>{item.movieYear}</td>
                        <td>{item.movieDirector}</td>
                        <td>
                            {item.movieGenres.map((gObj, gIndex) => (
                            <React.Fragment key={gObj.genreId}>
                                <Link to={`/movies?genreId=${gObj.genreId}`} className="link">{gObj.genreName}</Link>
                                {gIndex < item.movieGenres.length - 1 && ', '}
                            </React.Fragment>
                            ))}
                        </td>
                        <td>
                            {item.movieStars.map((sObj, sIndex) => (
                            <React.Fragment key={sObj.starId}>
                                <Link to={`/single-star?starId=${sObj.starId}`} className="link">{sObj.starName}</Link>
                                {sIndex < item.movieStars.length - 1 && ', '}   
                            </React.Fragment>
                            ))}
                        </td>
                        <td>{item.movieRating} 
                        <FontAwesomeIcon icon={faStar} color="#8DBA5E" size="sm" /></td>
                        <td>
                            <button className='addToCart' name='addToCart'
                            onClick={() => cart.addOne(item.movieId, item.movieTitle)}>
                                <FontAwesomeIcon icon={faPlus} color="white" size="sm" />
                            </button>
                        </td>

                    </tr>
                    ))}
                </tbody>
            </table>
            <div className='paginationButtons'>
                <button onClick={prevButtonEvent} disabled={currentPage === 1}>Prev</button>
                <span>{currentPage}</span>
                <button onClick={nextButtonEvent} disabled={Math.ceil(totalResult/perPage - 1) + 1 === currentPage}>Next</button>
            </div> */}
        </div>
    )
};

export default MoviesResult;