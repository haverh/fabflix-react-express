/* eslint-disable no-throw-literal */
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import './home.css';

// const fetchURL = process.env.REACT_APP_VERCEL_FETCH_URL;
const fetchURL = process.env.REACT_APP_LOCAL_FETCH_URL;

const Home = () => {

    const [genres, setGenres] = useState([]);

    useEffect(() => {
        console.log("USE EFFECT")
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
            elements.push(<Link key={`alpha-${i}`} className='link-style textSelect' to={`/movies?startCharacter=${alpha}`}>{alpha}</Link>);
        }

        for (let i = 0; i < 10; i++) {
            elements.push(<Link key={`number-${i}`} className='link-style textSelect' to={`/movies?startCharacter=${i}`}>{i}</Link>);
        }
    
        return (
            <section>
                <h1>Browse by Movie Title</h1>
                <div className="alphaBox">
                    {elements}
                </div>
            </section>
        )
    }

    // GenreSelect Component
    const GenreSelect = () => {
        const elements = [];
    
        for (let i = 0; i < genres.length; i++) {
            elements.push(<Link key={genres[i].id} className='textSelect link-style' to={`/movies?genreId=${genres[i].id}`}>{genres[i].name}</Link>);
        }
    
        return (
            <section>
                <h1>Browse by Movie Genre</h1>
                <div className="genreBox">
                
                    {elements}
                </div>
            </section>
            
        )
    }

    return (
        <div className="home-content">
            <GenreSelect/>
            <AlphaSelect/>
        </div>
        
    )
}

export default Home;