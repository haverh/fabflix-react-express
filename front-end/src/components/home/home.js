import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import './home.css';

const Home = () => {

    const [genres, setGenres] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch data for GenreSelect
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/homeDetails');
            const jsonData = await response.json();
            // console.log(jsonData)
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
            elements.push(<p key={`alpha-${i}`}><Link className='link-style' to={`/movies?startCharacter=${alpha}`}>{alpha}</Link></p> );
        }

        for (let i = 0; i < 10; i++) {
            elements.push(<p key={`number-${i}`}><Link className='link-style' to={`/movies?startCharacter=${i}`}>{i}</Link></p> );
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
            elements.push(<p key={genres[i].id}><Link className='link-style'>{genres[i].name}</Link></p>);
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