import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import './home.css';
import './alpha-select.css';
// import AlphaSelect from './alpha-select';
// import GenreSelect from './genre-select';

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
            console.log(jsonData)
            setGenres(jsonData);
          } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // AlphaSelect Component
    const AlphaSelect = () => {

        const elements = [];
    
        for (let i = 0; i < 26; i++) {
            elements.push(<p key={i}><Link className='link-style'>{String.fromCharCode(65 + i)} </Link> </p> );
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
    
        for (let i = 0; i < 26; i++) {
            elements.push(<p key={i}>{String.fromCharCode(65 + i)}</p>);
        }
    
        return (
            <div className="alphaBox">
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