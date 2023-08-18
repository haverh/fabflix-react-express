import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCartShopping } from '@fortawesome/free-solid-svg-icons';

const FulltextInput = () => {

    const fetchSuggestions = (event) => {
        event.preventDefault();
        
        const inputValue = event.target.value;

        console.log(inputValue);
    }

    const fetchData = (event) => {
        event.preventDefault();
        
        const inputValue = event.target.fsInput.value;

        console.log();
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
                    onChange={fetchSuggestions}
                />
                <button type='submit' className='rounded-right search-button' variant='outline-primary'>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </form>
        </div>
        
    )
}

export default FulltextInput;