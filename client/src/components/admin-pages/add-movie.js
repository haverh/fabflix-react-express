/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useRef } from 'react';
import './add-data.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from '@headlessui/react';

const AddMovie = () => {
  // const fetchURL = process.env.REACT_APP_VERCEL_FETCH_URL;
  const fetchURL = process.env.REACT_APP_LOCAL_FETCH_URL;

  const omdbAPI = "f6cd5e6f";
  const [formData, setFormData] = useState({});

  const [starName, setStarName] = useState('');
  const [starYear, setStarYear] = useState('');
  const [starList, setStarList] = useState([]);

  const [genre, setGenre] = useState('');
  const [genreList, setGenreList] = useState([]);

  const [formResponse, setFormResponse] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const formRef = useRef(null);

  // Create and add star object to list from input values
  const addStar = () => {
    if ( starName !== '' && starYear !== '') {
      setStarList(prev => [...prev, {
        'name': starName.trim(),
        'birthyear': starYear.trim()
      }]);
      setStarName('');
      setStarYear('');
    }
  }

  // Remove star object from list
  const removeStar = (index) => {
    const removedList = [...starList];
    removedList.splice(index, 1);
    setStarList(removedList);
  }

  // Create and add genre object to list from input values
  const addGenre = () => {
    if ( genre !== '' ) {
      setGenreList(prev => [...prev, genre.trim()]);
      setGenre('');
    }
    
  }

  // Remove genre object from list
  const removeGenre = (index) => {
    const removedList = [...genreList];
    removedList.splice(index, 1);
    setGenreList(removedList);
  }

  // Update formData with input values 
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Prevent "enter" key from submitting form
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  // Add star object to list when hitting "enter" key
  const handleKeydownStar = (event) => {
    if (event.key === 'Enter') {
      console.log("ENTER KEY PRESSED FOR STARS")
      addStar();
    }
  }

  // Add genre object to list when hitting "enter" key
  const handleKeydownGenre = (event) => {
    if (event.key === 'Enter') {
      console.log("ENTER KEY PRESSED FOR Genres")
      addGenre();
    }
  }

  // Add movie when pushing "Submit" button
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Fetch for poster and rating from OMDB API
    const omdbResponse = await fetch(`https://www.omdbapi.com/?i=${formData.movieId}&apikey=${omdbAPI}`);
    const ombdJsonData = await omdbResponse.json();

    // Updated formData with poster, rating, stars, and genres
    const updatedFormData = {
      ...formData,
      'moviePoster': ombdJsonData.Poster,
      'movieRating': parseFloat(ombdJsonData.imdbRating),
      'movieNumRating': parseFloat(ombdJsonData.imdbVotes),
      'movieStars': starList,
      'movieGenres': genreList,
    };

    console.log("HANDLE SUBMIT", updatedFormData);
    
    try {
      const response = await fetch(`${fetchURL}/api/admin/add-movie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(updatedFormData),
      });
      const jsonData = await response.json();
      setFormResponse(jsonData);
      setIsOpen(true);
      console.log(jsonData);

      // Clear form when movie is added
      if (jsonData.success === true) {
        const form = formRef.current;
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
          input.value = '';
        });
        setStarList([]);
        setGenreList([]);
      }
      
      // if (!response.ok) {
      //     throw {
      //         ...jsonData,
      //         status: response.status,
      //     }
      // }
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
        window.location.href = "login";
      }
    }
  }

  return (
    <div className="add-content">
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className='relative z-50'>
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-50 ">
          <Dialog.Panel className='relative w-full max-w-md p-3 rounded text-white bg-[#243666] shadow-lg'>
            <div className='flex flex-column items-center'>
              <FontAwesomeIcon 
                icon={(formResponse !== undefined && formResponse.success) ? faCircleCheck : faCircleExclamation} 
                color={(formResponse !== undefined && formResponse.success) ? "#64e692" : "#f48260"} 
                size='4x'/>
              <Dialog.Title className='font-bold'>{formResponse !== undefined && (formResponse.success ? 'SUCCESS' : 'ERROR')}</Dialog.Title>
            </div>
            <Dialog.Description>
              {formResponse !== undefined && formResponse.message}
            </Dialog.Description>
            <button onClick={() => setIsOpen(false)}
              className='absolute top-1 right-1 bg-[salmon] py-1 px-2 rounded'>
                <FontAwesomeIcon 
                icon={faXmark}
                size='lg'/>
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
      <h1 className='font-bold mb-4'>Add Movie</h1>
      <form onSubmit={(e) => handleSubmit(e)} onKeyDown={(e) => handleKeyDown(e)}
        ref={formRef}>
        <label htmlFor="movieId">Movie Id (IMDB):</label><br/>
        <input type="text" name="movieId" onChange={handleInputChange}></input><br/>
        
        <label htmlFor="movieTitle">Movie Title:</label><br/>
        <input type="text" name="movieTitle" onChange={handleInputChange}></input><br/>

        <label htmlFor="movieYear">Movie Year:</label><br/>
        <input type="text" name="movieYear" onChange={handleInputChange}></input><br/>

        <label htmlFor="movieDirector">Movie Director(s) (Separate by ", ")</label><br/>
        <input type="text" name="movieDirector" onChange={handleInputChange}></input><br/>

        <label htmlFor="movieStar">Movie Star</label><br/>  
        <div className='star-genre-box'>
          {starList.map((star, index) => (
            <span key={index} className='star-genre-bubble' onClick={() => {removeStar(index)}}>{star.name} ({star.birthyear})
              <FontAwesomeIcon icon={faXmark} style={{color: "red", marginLeft: "5px"}} />
            </span>
          ))}
        </div>
        <input type="text" name="movieStar" placeholder='Star Name' id='starName'
          value={starName} onChange={(e) => setStarName(e.target.value)}
          onKeyDown={handleKeydownStar}></input>
        <input type="text" name="movieStar" placeholder='Birth Year' id='starYear'
          value={starYear} onChange={(e) => setStarYear(e.target.value)}
          onKeyDown={handleKeydownStar}></input><br/>
        <button onClick={addStar} type='button' className='sub-btn'>Add Star</button><br/>

        <label htmlFor="movieGenre">Movie Genre</label><br/>
        <div className='star-genre-box'>
          {genreList.map((genre, index) => (
            <span key={index} className='star-genre-bubble' onClick={() => {removeGenre(index)}}>{genre}
              <FontAwesomeIcon icon={faXmark} style={{color: "red", marginLeft: "10px"}} />
            </span>
          ))}
        </div>
        <input type="text" name="movieGenre" placeholder='Genre'  
          value={genre} onChange={(e) => setGenre(e.target.value)}
          onKeyDown={handleKeydownGenre}></input><br/>
        <button onClick={addGenre} type='button' className='sub-btn'>Add Genre</button><br/>

        <button type='submit'
          className='w-full text-lg text-center font-bold p-[10px] rounded-[10px] mt-4 bg-[#2e7f7d]'>Add Movie</button>
      </form>
    </div>
  )
}

export default AddMovie;