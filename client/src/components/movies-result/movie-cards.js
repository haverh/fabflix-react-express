import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './movies-result.css';

import posterPlaceholder  from '../../img/img-placeholder.png';

const MovieCards = ({ movieData, currentPage, perPage }) => {
  console.log(movieData)
  return (
    <div className='card-container w-full h-auto'>
      {movieData.slice((currentPage - 1) * perPage, (currentPage - 1) * perPage + 10).map((item, index) => (
        <Link to={`/single-movie?movieId=${item.movieId}`} key={item.movieId}
          className='movie-card w-full border-2 border-solid border-[white] hover:border-[#25c7c7] rounded-[10px] my-[10px] mx-[1px] p-[1px] flex no-underline text-[aliceblue]'>
          {item.moviePoster !== "N/A" 
          ? <div className='movie-poster-frame'>
              <img className='movie-poster w-full h-full rounded-[10px] ' src={item.moviePoster} alt="Movie Poster"></img>
            </div>
          : <div className='movie-poster-frame'>
              <img className='movie-placeholder w-[90px] h-auto my-0 mx-[5px] rounded-[10px] sm:w-[150px] sm:h-[200px] md:w-[170px] md:h-[230px]' src={posterPlaceholder} alt="Movie Poster"></img>
            </div>
          }
          <div className='result-movie-info w-full flex flex-col justify-evenly items-start p-0'>
            <h2 className='w-full text-[#4FBDBA] text-[1.3em] font-bold sm:text-[1.5em] md:text-[1.7em]'>{item.movieTitle}</h2>
            <p className='year-rating w-full flex justify-between py-0 pr-[10px] pl-0'>
              <span className='text-base'>{item.movieYear}</span>
              <span className='movie-rating text-[0.8em] sm:text-[1.1em] md:text-[1.2em]'>{item.movieRating}<FontAwesomeIcon icon={faStar} color="#8DBA5E" size="sm" /></span>
            </p>
            <p className='w-full text-base'><span className='movie-key'>Directed by</span> {item.movieDirector}</p>
            <p className="hidden sm:block ">
              <span className='movie-key'>Plot</span> {item.plot.length <= 150 
              ? item.plot
              : `${item.plot.slice(0,150)}...` }
            </p>
            {/* <p>Plot: {item.plot.length}</p> */}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default MovieCards;