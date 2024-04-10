/* eslint-disable no-throw-literal */
import React, { useState, useRef } from "react";
import './add-data.css';

import Modal from '../modal/modal';

const AddGenre = () => {
  // const fetchURL = process.env.REACT_APP_VERCEL_FETCH_URL;
  const fetchURL = process.env.REACT_APP_LOCAL_FETCH_URL;

  const [genreName, setGenreName] = useState('');
  
  const [formResponse, setFormResponse] = useState(undefined);

  const formRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('SUBMITTED', genreName);

    try {
      const response = await fetch(`${fetchURL}/api/admin/add-genre`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({'genreName': genreName})
      });

      const jsonData = await response.json();
      console.log(jsonData)

      if (!response.ok) {
        throw {
          ...jsonData,
          status: response.status,
        }
      }

      setFormResponse(jsonData);

      // Claer form when submitting
      const form = formRef.current;
      const inputs = form.querySelectorAll('input');
      inputs.forEach(input => {
        input.value = '';
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === 'TokenExpiredError' || error.name === 'NoTokenError' ) {
        window.location.href = '../login';
      }
    }
  }

  return (
    <div className="add-content">
      <Modal formResponse={formResponse}/>
      <h1 className='page-title'>Add Genre</h1>
      <form onSubmit={(e) => handleSubmit(e)} ref={formRef}>
        <label htmlFor="genreName">Genre Name</label><br/>
        <input type="text" name="genreName"
          onChange={(e) => setGenreName(e.target.value)}></input><br/>

        <button type='submit'
          className='w-full text-lg text-center font-bold p-[10px] rounded-[10px] mt-4 bg-[#2e7f7d]'>
          Add Genre
        </button>
      </form>
    </div>
  )
}

export default AddGenre;