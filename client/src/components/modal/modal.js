import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons';


const Modal = ({formResponse}) => {
  const fetchURL = process.env.REACT_APP_VERCEL_FETCH_URL;
  // const fetchURL = process.env.REACT_APP_LOCAL_FETCH_URL;

  // To determine whether modal is displayed
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() =>{
    if ( formResponse !== undefined ) {
      setIsOpen(true);
    }
  },[formResponse])

  return (
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
  )
}

export default Modal;