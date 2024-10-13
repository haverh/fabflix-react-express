/* eslint-disable no-throw-literal */
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Loading from '../loading/loading';

import fetchURL from '../../config';

import './home.css';

console.log(fetchURL)

const Home = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

      console.log(jsonData)
      setGenres(jsonData.genreList);
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchData();
  }, []);

  // AlphaSelect Component
  const AlphaSelect = () => {

    const elements = [];

    for (let i = 0; i < 26; i++) {
      const alpha = String.fromCharCode(65 + i);
      elements.push(<Link key={`alpha-${i}`} className='link-style px-3' to={`/movies?startCharacter=${alpha}`}>{alpha}</Link>);
    }

    for (let i = 0; i < 10; i++) {
      elements.push(<Link key={`number-${i}`} className='link-style px-3' to={`/movies?startCharacter=${i}`}>{i}</Link>);
    }

    return (
      <section className='w-full flex flex-col m-3 justify-center items-center text-center'>
        <h1>Browse by Movie Title</h1>
        <div className="alphaBox grid text-center grid-cols-6 gap-[5px] text-bold rounded-xl bg-[#172A46]">
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
        <div className="genreBox grid text-center grid-cols-3 gap-[5px] text-bold rounded-xl bg-[#172A46]">
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