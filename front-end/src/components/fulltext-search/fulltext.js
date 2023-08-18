import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const FulltextInput = () => {

    const [suggestionsMap, setSuggestionsMap] = useState({});

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
        console.log(suggestionsMap)

        if ( suggestionsMap[inputValue] ) {
            console.log("YES");
            return suggestionsMap[inputValue];
        } else { // undefined
            console.log("NO"); 
            const suggestions = await fetchSuggestions(inputValue);
            setSuggestionsMap(
                prevSuggestions => ({
                    ...prevSuggestions,
                    [inputValue]: suggestions
                })
            )
            // console.log(suggestions);
            return suggestions;
        }
    }

    const fetchData = (event) => {
        event.preventDefault();
        
        const inputValue = event.target.fsInput.value;

        console.log(inputValue);
    }


    return (
        <div className="search-component h-100">
            <form className="d-flex input-group w-auto" onSubmit={fetchData}>
                <input
                    name='fsInput'
                    type="search"
                    className="me-0 rounded-left search-input"
                    placeholder="Fulltext Search"
                    aria-label="Search"
                    aria-describedby="search-addon"
                    onChange={handleSuggestions}
                />
                <button type='submit' className='rounded-right search-button' variant='outline-primary'>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </form>
        </div>
        
    )
}

export default FulltextInput;