import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import './fulltext.css'

const FulltextInput = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionsMap, setSuggestionsMap] = useState({"": []});
    const [selectedSuggestion, setSelected] = useState(-1);
    const [hoveredSelectedSuggestion, setHoverSelected] = useState(-1);

    const fetchSuggestions = async (input) => {
        return fetch(`http://localhost:5000/api/fulltext?input=${input}`)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching data:', error);
            return null; // Return null or some default value in case of error
        });
    }

    const handleSuggestions = async (event) => {
        const inputValue = event.target.value;
        
        
        if ( suggestionsMap[inputValue] ) {
            setSuggestions(suggestionsMap[inputValue])
            return suggestionsMap[inputValue];
        } else { // undefined
            const suggestions = await fetchSuggestions(inputValue);
            setSuggestionsMap(
                prevSuggestions => ({
                    ...prevSuggestions,
                    [inputValue]: suggestions
                })
            )
            setSuggestions(suggestions);
            return suggestions;
        }
    }

    const handleKeyDown = (event) => {
        if ( event.key === "ArrowUp" ) {
            setSelected(Math.max(selectedSuggestion - 1, -1));
            setHoverSelected(-1);
        } else if ( event.key === "ArrowDown" ) {
            setSelected(Math.min(selectedSuggestion + 1, suggestions.length - 1));
            setHoverSelected(-1);
        } else if ( event.key === "Enter") {
            fetchMovie();

        }
    }

    const fetchMovie = () => {
        console.log("PRESSED")

        // Determine if clicked/entered and get movie info from suggestions
        let movie = (selectedSuggestion !== -1) 
        ? suggestions[selectedSuggestion] 
        : suggestions[hoveredSelectedSuggestion];

        const movieId = movie.movieId;

        window.location.href = `/single-movie?movieId=${movieId}`
        setSelected(-1);
        setHoverSelected(-1);
        setSuggestions([]);
    }

    return (
        <div className="search-component h-100">
            <form className="d-flex input-group w-auto" onSubmit={(event) => {event.preventDefault();}}>
                <input
                    name='fsInput'
                    type="search"
                    className="search-input"
                    placeholder="Fulltext Search"
                    aria-label="Search"
                    aria-describedby="search-addon"
                    onChange={handleSuggestions}
                    onKeyDown={handleKeyDown}
                />
                <button type='submit' className='m-0 search-button' variant='outline-primary'>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </form>
            {suggestions.length > 0 && (
                <ul className='suggestions'>
                    {suggestions.map((suggestion, index) => (
                    <li key={index} className={
                        index === selectedSuggestion 
                        ? 'selected' 
                        : index === hoveredSelectedSuggestion
                        ? 'hovered'
                        : ''
                    }
                    
                    onMouseEnter={() => {setHoverSelected(index); setSelected(-1);}}
                    onMouseLeave={() => setHoverSelected(-1)}
                    onClick={ fetchMovie }
                    >
                        {suggestion.movieTitle}
                    </li>))}
                </ul>
            )}
        </div>
        
    )
}

export default FulltextInput;