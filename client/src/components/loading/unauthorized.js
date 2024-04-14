import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faLock } from '@fortawesome/free-solid-svg-icons';

const goHome = () => {
  window.location.href = "../home";
}

const UnauthorizedPage = () => {
  return (
    <div className='flex h-full justify-center items-center'>
    <div className=' p-3 w-fit h-fit rounded flex flex-col items-center'>
      <FontAwesomeIcon icon={faLock} size='5x' className='mb-4'/>
      <h1 className='font-bold flex flex-col'>403 - Unauthorized</h1>
      <h2 className='text-xl'>You are not authorized to access this page.</h2>
      <button onClick={() => goHome()} 
        className='w-fit p-2 bg-[transparent] border border-solid rounded mt-3 hover:bg-gray-800'>
        <FontAwesomeIcon icon={faHouse} className='mr-1'/>
        Home
      </button>
    </div>
    </div>
  )
}

export default UnauthorizedPage;