/* eslint-disable no-throw-literal */
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Loading from '../loading/loading';

import './home.css';

// const fetchURL = process.env.REACT_APP_VERCEL_FETCH_URL;
const fetchURL = process.env.REACT_APP_LOCAL_FETCH_URL;

const Home = () => {

  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data for GenreSelect
  const fetchData = async () => {
    try {
      const response = await fetch(`${fetchURL}/api/homeDetails`, {
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
      setLoading(false);

      console.log(jsonData)
      setGenres(jsonData.genreList);
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
        window.location.href = "login";
      }
    }
  };

  // AlphaSelect Component
  const AlphaSelect = () => {

    const elements = [];

    for (let i = 0; i < 26; i++) {
      const alpha = String.fromCharCode(65 + i);
      elements.push(<Link key={`alpha-${i}`} className='link-style' to={`/movies?startCharacter=${alpha}`}>{alpha}</Link>);
    }

    for (let i = 0; i < 10; i++) {
      elements.push(<Link key={`number-${i}`} className='link-style' to={`/movies?startCharacter=${i}`}>{i}</Link>);
    }

    return (
      <section className='w-full flex flex-col m-3 justify-center items-center text-center'>
        <h1>Browse by Movie Title</h1>
        <div className="alphaBox grid text-center grid-cols-12 gap-[5px] text-bold rounded-[15px] bg-[#041C32] sm:gap-[10px] md:gap-[20px] lg:gap-[25px]">
          {elements}
        </div>
      </section>
    )
  }

  // GenreSelect Component
  const GenreSelect = () => {
    const elements = [];

    for (let i = 0; i < genres.length; i++) {
      elements.push(<Link key={genres[i].id} className='link-style' to={`/movies?genreId=${genres[i].id}&genreName=${genres[i].name}`}>{genres[i].name}</Link>);
    }

    return (
      <section className='w-full flex flex-col m-3 justify-center items-center text-center'>
        <h1>Browse by Movie Genre</h1>
        <div className="genreBox grid text-center grid-cols-3 gap-[5px] text-bold rounded-[15px] bg-[#041C32] sm:grid-cols-4 sm:gap-[5px] md:grid-cols-5 lg:grid-cols-6 lg:gap-[5px]">
          {elements}
        </div>
      </section>
      
    )
  }

  return (
    loading ? <Loading /> :
    <div className="w-full h-[90%] py-[3%] px-[10%] flex flex-col justify-center items-center">
      <GenreSelect/>
      <AlphaSelect/>
    </div>
  )
}

export default Home;