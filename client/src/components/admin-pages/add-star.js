/* eslint-disable no-throw-literal */
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import './add-data.css';

import fetchURL from '../../config';

import Modal from '../modal/modal';

const AddStar = () => {
  const navigate = useNavigate();
  const [starName, setStarName] = useState('');
  const [starYear, setStarYear] = useState('');
  const [starList, setStarList] = useState([]);

  const [formResponse, setFormResponse] = useState(undefined);

  const formRef = useRef(null);

  // // Create and add star object to list from input values
  // const addStar = () => {
  //   console.log(starName, starYear)
  //   if ( starName !== '' && starYear !== '' ) {
  //     setStarList(prev => [...prev, {
  //       'name': starName.trim(),
  //       'birthyear': starYear.trim()
  //     }]);
  //     setStarName('');
  //     setStarYear('');
  //   }
  // }

  // // Remove star object from list
  // const removeStar = (index) => {
  //   const removedList = [...starList];
  //   removedList.splice(index, 1);
  //   setStarList(removedList);
  // }

  // // Prevent "enter" key from submitting form
  // const handleKeyDown = (event) => {
  //   event.preventDefault();
  //   handleSubmit(event);
  // }

  // // Add star object to list when hitting "enter" key
  // const handleKeydownStar = (event) => {
  //   if (event.key === 'Enter') {
  //     console.log("ENTER KEY PRESSED FOR STARS")
  //     addStar();
  //   }
  // }

  // Add star when when submitting form
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('SUBMITTED', starList, starName, starYear);

    try {
      const response = await fetch(`${fetchURL}/api/admin/add-star`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({'starName': starName, 'starYear': starYear})
      });
      const jsonData = await response.json();
      // console.log(jsonData)

      if (!response.ok) {
        throw {
          ...jsonData,
          status: response.status,
        }
      }

      setFormResponse(jsonData);

      // Clear form when submitting
      const form = formRef.current;
      const inputs = form.querySelectorAll('input');
      inputs.forEach(input => {
        input.value = '';
      });
      
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
        navigate("/login");
      }
    }
  }

  return (
    <div className="add-content">
      <Modal formResponse={formResponse}/>
      <h1 className='page-title'>Add Star</h1>
      <form onSubmit={(e) => handleSubmit(e)} ref={formRef}>
        {/* <div className='star-genre-box'>
          {starList.map((star, index) => (
            <span key={index} className='star-genre-bubble' onClick={() => {removeStar(index)}}>{star}>
              <FontAwesomeIcon icon={faXmark} style={{color: "red", marginLeft: "5px"}} />
            </span>
          ))}
        </div> */}

        <label htmlFor="starName">Star Name</label><br/>
        <input type="text" name="starName" 
          onChange={(e) => setStarName(e.target.value)}></input><br/>

        <label htmlFor="starYear">Birth Year</label><br/>
        <input type="number" name="starYear"
          min={1}
          max={new Date().getFullYear()}
          onChange={(e) => setStarYear(e.target.value)}></input><br/>

        <button type='submit'
          className='w-full text-lg text-center font-bold p-[10px] rounded-[10px] mt-4 bg-[#2e7f7d]'>
          Add Star
        </button>
      </form>
    </div>
  )
}

export default AddStar;