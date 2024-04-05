/* eslint-disable array-callback-return */
/* eslint-disable no-throw-literal */
import React, { useState, useEffect } from 'react';

// const fetchURL = process.env.REACT_APP_VERCEL_FETCH_URL;
const fetchURL = process.env.REACT_APP_LOCAL_FETCH_URL;


const SchemaTable = ({ table_name, table_fields }) => {
  console.log(table_name)
  return (
    <div className='bg-white text-black w-1/2 my-4'>
      <h2 className='bg-[aqua]'>{table_name}</h2>
      <div className='flex'>
        <h3 className='bg-[salmon] w-1/2'>Column Name</h3>
        <h3 className='bg-[lightblue] w-1/2'>Data Type</h3>
      </div>

      <div className='bg-[lightcyan] flex flex-col'>
        { table_fields.map((field) => (
          <div className='flex'>
            <p className='w-1/2'>{field.column_name}</p>
            <p className='w-1/2'>{field.data_type}</p>
          </div>
        ))
        }
      </div>
    </div>
  )
} 


const Admin_Home = () => {

  const [tableArray, setTableArray] = useState([]);

  // Fetch for data only once when mounted
  useEffect(() => {
    console.log("USE EFFECT")
    fetchSchemas();
  }, []);

  // Fetch data for table schemas
  const fetchSchemas = async () => {
    try {
      const response = await fetch(`${fetchURL}/api/admin/get-schema`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      const jsonData = await response.json();

      if (!response.ok) {
        throw {
          ...jsonData,
          status: response.status,
        }
      }

      setTableArray(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === 'TokenExpiredError' || error.name === 'NoTokenError' ) {
        window.location.href = '../login';
      }
    }
  }

  console.log("LAST CONSOLE", tableArray)

  return (
    <div className='admin-add-content flex flex-col justify-center items-center'>
      <h1 className='font-bold'>Database Schema</h1>
      {
        tableArray.map((table, index) => (
          <SchemaTable 
            key={index}
            table_name= {table.table_name}
            table_fields={table.fields}/>
        ))
      }
    </div>
  )
}

export default Admin_Home;