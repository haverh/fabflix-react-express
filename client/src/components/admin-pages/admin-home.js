/* eslint-disable array-callback-return */
/* eslint-disable no-throw-literal */
import React, { useState, useEffect } from 'react';

// const fetchURL = process.env.REACT_APP_VERCEL_FETCH_URL;
const fetchURL = process.env.REACT_APP_LOCAL_FETCH_URL;


// Table Component
const SchemaTable = ({ table_name, table_fields }) => {
  console.log(table_name)
  return (
    <div className='schema-table text-black w-3/4 max-w-[420px] my-4'>
      <h2 className='text-white font-bold'>"{table_name}" Table</h2>
      <div className='flex'>
        <h3 className='bg-[#041C32] text-white w-1/2 m-0 p-2 font-bold border border-solid border-black'>Column Name</h3>
        <h3 className='bg-[#041C32] text-white w-1/2 m-0 p-2 font-bold border border-solid border-black'>Data Type</h3>
      </div>

      <div className='bg-[#022747] flex flex-col'>
        { table_fields.map((field) => (
          <div className='flex'>
            <p className='text-white w-1/2 m-0 p-2 border border-solid border-black'>{field.column_name}</p>
            <p className='text-white w-1/2 m-0 p-2 border border-solid border-black'>{field.data_type}</p>
          </div>
        ))
        }
      </div>
    </div>
  )
} 


const AdminHome = () => {

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

export default AdminHome;