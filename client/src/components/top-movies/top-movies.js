/* eslint-disable no-throw-literal */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './top-movies.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../../contexts/CartContext';
import posterPlaceholder  from '../../img/img-placeholder.png';

const TopMovies = () => {
    const omdbAPI = "f6cd5e6f";

    const cart = useContext(CartContext);

    const [top, setTop] = useState([]);
    // const [OMDbInfo, setOMDbInfo] = useState({});

    // const fetchURL = process.env.REACT_APP_VERCEL_FETCH_URL;
    const fetchURL = process.env.REACT_APP_LOCAL_FETCH_URL;

    // Fetch top movies and their respective poster
    const fetchData = useCallback(async () => {
        console.time("fetchTime");
        try {
            const response = await fetch(`${fetchURL}/api/topmovies`, {
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

            // console.time("Poster Fetch Time")
            // const topPromises = jsonData.map(async (obj) => {
            //     const response = await fetch(`https://www.omdbapi.com/?i=${obj.movieId}&apikey=${omdbAPI}`);
            //     const jsonData = await response.json();
            //     const poster = jsonData.Poster !== "N/A" ? jsonData.Poster : posterPlaceholder;
            //     return  {...obj, moviePoster:poster};
            // })

            // const updatedTop = await Promise.all(topPromises);
            // console.timeEnd("Poster Fetch Time")
            // setTop(updatedTop);
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
        <div className="top-movies-content">
            <h1>Top 20 Rated Movies</h1>
            <div className='grid-container'>
                <div className='movies-grid'>
                    {top.map((item) => (
                        <div key={item.movieId}>
                            <Link to={`/single-movie?movieId=${item.movieId}`} className='grid-item'>
                                <img className='poster' src={item.moviePoster} alt="Movie Poster"></img>
                                <div className='movie-info'>
                                    <h1>{item.movieTitle}</h1>
                                    <h2>
                                        <span>{item.movieYear}</span>
                                        <span>{item.movieRating}
                                            <span className="fa-layers fa-fw">
                                                <FontAwesomeIcon icon={faStar} color="#C5E898" size="sm"/>
                                            </span>
                                        </span>
                                    </h2>
                                    </div>
                            </Link>
                            <button className='addToCart' name='addToCart'
                                onClick={() => cart.addOne(item.movieId, item.movieTitle)}>
                                ADD TO CART
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div id="attribution">
                <a href="https://www.flaticon.com/free-icons/image" title="image icons">Image icons created by Pixel perfect - Flaticon</a>
            </div>
            
            
            {/* <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
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
                    {rows.map((item) => (
                        <tr key={item.movieId}>
                            <td><Link to={`/single-movie?movieId=${item.movieId}`} className="link">{item.movieTitle}</Link></td>
                            <td>{item.movieYear}</td>
                            <td>{item.movieDirector}</td>
                            <td>
                                {item.movieGenres.map((gObj, gIndex) => (
                                <React.Fragment key={gObj.genreid}>
                                    <Link key={gObj.genreid} to={`/movies?genreId=${gObj.genreid}`} className="link">{gObj.name}</Link>
                                    {gIndex < item.movieGenres.length - 1 && ', '}
                                </React.Fragment>
                                ))}
                            </td>
                            <td>
                                {item.movieStars.map((sObj, sIndex) => (
                                <React.Fragment key={sObj.starid}>
                                    <Link key={sObj.starid} to={`/single-star?starId=${sObj.starid}`} className="link">{sObj.name}</Link>
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
                        // <tr key={item.movieId}>
                        //     <td><Link to={`/single-movie?movieId=${item.movieId}`} className="link">{item.movieTitle}</Link></td>
                        //     <td>{item.movieYear}</td>
                        //     <td>{item.movieDirector}</td>
                        //     <td>
                        //         {item.movieGenres.map((gObj, gIndex) => (
                        //             <React.Fragment key={gObj.genreid}>
                        //                 <Link to={`/movies?genreId=${gObj.genreid}`} className="link">{gObj.name}</Link>
                        //                 {gIndex < item.movieGenres.length - 1 && ', '}
                        //             </React.Fragment>
                        //         ))}
                        //     </td>
                        //     <td>
                        //         {item.movieStars.map((sObj, sIndex) => (
                        //             <React.Fragment key={sObj.starId}>
                        //                 <Link to={`/single-star?starId=${sObj.starid}`} className="link">{sObj.name}</Link>
                        //                 {sIndex < item.movieStars.length - 1 && ', '}
                        //             </React.Fragment>
                        //         ))}
                        //     </td>
                        //     <td>{item.movieRating}
                        //         <FontAwesomeIcon icon={faStar} color="#8DBA5E" size="sm" /></td>
                        //     <td>
                        //         <button className='addToCart' name='addToCart'
                        //             onClick={() => cart.addOne(item.movieId, item.movieTitle)}>
                        //             <FontAwesomeIcon icon={faPlus} color="white" size="sm" />
                        //         </button>
                        //     </td>
                        // </tr>
                    ))}
                </tbody>
            </table> */}
        </div>
    )
}

export default TopMovies;