import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentsDollar, faSearch } from '@fortawesome/free-solid-svg-icons';

import fetchURL from '../../config';

import './fulltext.css'


const FulltextInput = () => {
  const [currentInput,  setCurrentInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsMap, setSuggestionsMap] = useState({"": []}); // Map of input text -> movie suggestions
  const [selectedSuggestion, setSelected] = useState(-1);
  const [hoveredSelectedSuggestion, setHoverSelected] = useState(-1);
  

  // Fetch movies given input from endpoint
  const fetchSuggestions = async (input) => {
    return fetch(`${fetchURL}/api/fulltext?input=${input}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    })
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching data:', error);
      return null; // Return null or some default value in case of error
    });
  }

  // Get and display suggestions
  const handleSuggestions = async (event) => {
    const inputValue = event.target.value;
    setCurrentInput(inputValue);
    if ( suggestionsMap[inputValue] ) { // Input exists in map
      setSuggestions(suggestionsMap[inputValue])
      return suggestionsMap[inputValue];
    } else { // Input doesn't exist in map
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

  // Handle suggestions navigation 
  const handleKeyDown = (event) => {
    if ( event.key === "ArrowUp" ) {
      setSelected(Math.max(selectedSuggestion - 1, -1));
      setHoverSelected(-1);
    } else if ( event.key === "ArrowDown" ) {
      setSelected(Math.min(selectedSuggestion + 1, suggestions.length - 1));
      setHoverSelected(-1);
    } else if ( event.key === "Enter") {
      selectMovie();

    }
  }

  // Go to selected movie page
  const selectMovie = () => {

    // Determine if clicked/entered and get movie info from suggestions
    let movie = (selectedSuggestion !== -1) 
    ? suggestions[selectedSuggestion] 
    : (hoveredSelectedSuggestion !== -1) 
    ? suggestions[hoveredSelectedSuggestion]
    : currentInput;

    if (selectedSuggestion === -1 && hoveredSelectedSuggestion === -1) {
      console.log("SEARCH FOR THIS ==> ", currentInput)
      window.location.href = `/movies?title=${currentInput}`
    } else {
      const movieId = movie.movieId;

      window.location.href = `/single-movie?movieId=${movieId}`
    }
    setSelected(-1);
    setHoverSelected(-1);
    setSuggestions([]);
    
  }

  return (
    <div className="search-component h-100 m-0">
      <form className="d-flex input-group w-auto justify-center items-center" onSubmit={(event) => {event.preventDefault();}}>
        <input
            name='fsInput'
            type="search"
            className="search-input  w-[300px] m-0 p-1 rounded-tl-[10px] rounded-bl-[10px] text-[#0b233a]"
            placeholder="Fulltext Search"
            aria-label="Search"
            aria-describedby="search-addon"
            onChange={handleSuggestions}
            onKeyDown={handleKeyDown}
        />
        <button type='submit' name='search' className='search-button m-0 p-1 rounded-tr-[10px] rounded-br-[10px] w-[35px]' variant='outline-primary'>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
      {suggestions.length > 0 && (
        <ul className='suggestions absolute list-none m-0 mt-[3px] p-0 text-[#57C5B6] bg-[#002B5B] w-[300px] rounded-[5px] z-[2]'>
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
          onClick={ selectMovie }
          >
            {suggestion.movieTitle}
          </li>))}
        </ul>
      )}
    </div>
  )
}

export default FulltextInput;