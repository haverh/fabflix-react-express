import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import './home.css';

const Home = () => {

    const [genres, setGenres] = useState([]);
    console.log("HOME")

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch data for GenreSelect
    const fetchData = async () => {
        try {
            const response = await fetch('https://gotcha-movies-server.vercel.app/api/homeDetails');
            const jsonData = await response.json();
            setGenres(jsonData);
          } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // AlphaSelect Component
    const AlphaSelect = () => {

        const elements = [];
    
        for (let i = 0; i < 26; i++) {
            const alpha = String.fromCharCode(65 + i);
            elements.push(<p key={`alpha-${i}`} className='textSelect'><Link className='link-style' to={`/movies?startCharacter=${alpha}`}>{alpha}</Link></p> );
        }

        for (let i = 0; i < 10; i++) {
            elements.push(<p key={`number-${i}`} className='textSelect'><Link className='link-style' to={`/movies?startCharacter=${i}`}>{i}</Link></p> );
        }
    
        return (
            <div className="alphaBox">
                {elements}
            </div>
        )
    }

    // GenreSelect Component
    const GenreSelect = () => {
        const elements = [];
    
        for (let i = 0; i < genres.length; i++) {
            elements.push(<p key={genres[i].id} className='textSelect'><Link className='link-style' to={`/movies?genreId=${genres[i].id}`}>{genres[i].name}</Link></p>);
        }
    
        return (
            <div className="genreBox">
                {elements}
            </div>
        )
    }

    return (
        <div className="home-content">
            <AlphaSelect/>
            <GenreSelect/>
        </div>
        
    )
}

export default Home;