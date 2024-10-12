import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './movies-result.css';

import posterPlaceholder  from '../../img/img-placeholder.png';

const MovieCards = ({ movieData, currentPage, perPage }) => {
  console.log(movieData)
  return (
    <div className='card-container w-full h-auto flex flex-col items-center'>
      {movieData.slice((currentPage - 1) * perPage, (currentPage - 1) * perPage + 10).map((item, index) => (
        <Link to={`/single-movie?movieId=${item.movieId}`} key={item.movieId}
          className='movie-card max-w-[600px] w-full border-1 border-solid border-[white] hover:border-[#25c7c7] hover:bg-[#24c6c628] rounded-[10px] my-[10px] mx-[1px] p-[1px] flex no-underline text-[aliceblue]'>
          <div className="movie-poster-frame">
            {item.moviePoster !== "N/A" 
            ? <img className='movie-poster rounded-lg ' src={item.moviePoster} alt="Movie Poster"></img>
            : <div className='movie-poster size-full flex justify-center items-center rounded-lg border border-white'>
                <img className='max-w-[100px] max-h-[100px]' src={posterPlaceholder} alt="Movie Poster"></img>
              </div>
            }
          </div>
          <div className='result-movie-info w-full flex flex-col justify-evenly items-start p-0'>
            <h2 className='w-full text-[#4FBDBA] text-[1.3em] font-bold sm:text-[1.5em] md:text-[1.7em]'>{item.movieTitle}</h2>
            <p className='year-rating w-full flex justify-between py-0 pr-[10px] pl-0'>
              <span className='text-base'><span className='movie-key'>Year</span> {item.movieYear}</span>
              <span className='movie-rating text-[em] sm:text-[1.1em] md:text-[1.2em]'>{item.movieRating}<FontAwesomeIcon icon={faStar} color="#8DBA5E" size="sm" /></span>
            </p>
            <p className='w-full text-base'><span className='movie-key'>Directed by</span> {item.movieDirector}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default MovieCards;