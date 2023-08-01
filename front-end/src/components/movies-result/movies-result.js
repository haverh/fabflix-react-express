import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faStar } from '@fortawesome/free-solid-svg-icons';

import './movies-result.css';

const MoviesResult = () => {

    
    const [movieData, setMovieData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResult, setTotal] = useState(-1);
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortBy, setSortBy] = useState("rating");
    const [isExhausted, setIsExhausted] = useState(false);

    const perPage = 10;
    const numPage = 5;
    const location = useLocation()

    const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);


    // useEffect(() => {
    //     console.log("total", totalResult);
    //     console.log("data", movieData);
    // }, [movieData]);

    useEffect(() => {
        // console.log("isExhausted =", isExhausted);
        // console.log("movieData.length =", movieData.length, movieData.length != totalResult, isExhausted && (movieData.length != totalResult));
        // console.log("totalResult =", totalResult);
        if ( (isExhausted && (movieData.length !== totalResult)) || currentPage === 1 ) {
            
            fetchDataManager(urlParams);
        }
    }, [urlParams, currentPage]);

    useEffect(() => {
        setMovieData([]);
        setTotal(-1);
        setCurrentPage(1);
        setIsExhausted(false);
    }, [sortOrder, sortBy])

    const fetchByStartChar = async (startCharacter) => {
        try {
            const params = new URLSearchParams({startCharacter, currentPage, sortOrder, sortBy, perPage, numPage});
            const response = await fetch(`http://localhost:5000/api/byStartCharacter?${params}`);
            const jsonData = await response.json();
            console.log(jsonData);
            if ( currentPage === 1 ) { setTotal(jsonData.total); }
            setIsExhausted(false);
            
            setMovieData([...movieData, ...jsonData.moviesList]);
          } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Decide which endpoint to call
    const fetchDataManager = (urlParams) => {
        if (urlParams.get('startCharacter')) {
            fetchByStartChar(urlParams.get('startCharacter'));
        }
    };

    const changeSortOrder = () => {
        console.log(sortOrder);
        if (sortOrder === "asc") {
            setSortOrder("desc");
        } else {
            setSortOrder("asc");
        }
    };

    const prevButtonEvent = () => {
        if ( currentPage > 1 ) {
            setCurrentPage((current) => current - 1)
        }
        
    };

    const nextButtonEvent = () => {
        setCurrentPage((current) => current + 1)
        if ( (currentPage % 5) === 4 ) { setIsExhausted(true); }
    };


    return (
        <div className="page-content">
            <h1>Movies Result</h1>
            <div style={{display:"flex", justifyContent: "end", gap: "1%"}}>
                <label defaultValue={sortBy} onChange={ (e) => {setSortBy(e.target.value)} } htmlFor="sortby">Sort By: 
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
                                <Link to="#" className="link">{gObj.genreName}</Link>
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

                    </tr>
                    ))}
                </tbody>
            </table>
            <div className='paginationButtons'>
                <button onClick={prevButtonEvent} disabled={currentPage === 1}>Prev</button>
                <span>{currentPage}</span>
                <button onClick={nextButtonEvent}>Next</button>
            </div>
        </div>
    )
}

export default MoviesResult;