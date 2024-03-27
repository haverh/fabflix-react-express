import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { SessionContext } from '../../App.js';
import './signin.css';

import logo from '../../img/logo_transparent.png';

// const axios = require('axios');

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // // const fetchURL = process.env.REACT_APP_VERCEL_FETCH_URL;
  const fetchURL = process.env.REACT_APP_LOCAL_FETCH_URL;
  const [loginData, setLoginData] = useState({data: {status: true}});

  // Axios.defaults.withCredentials = true;
  // useEffect(() => {
  //     Axios.get("http://localhost:5000/api/login")
  //     .then( (res) => {
  //         console.log(res.data);  
  //     })
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    Axios.post(`${fetchURL}/api/login`, {
      email: email,
      password: password,
    })
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        console.log("LOGIN SUCCESSUL", res.data);
        setLoginData(res.data);
        window.location.href = "home";
      }
    }).catch(err => {
      console.log(err.response.data);
      setLoginData(err.response.data);
    })
  };

  return (
    <div className='login-content w-full h-[95%] py-[3%] px-[10%] flex items-center'>
      <div className="signin-widget flex flex-col items-center min-w-[300px] max-w-[350px] m-auto h-3/5 p-[10px] bg-[#041C32] rounded-[10px] sm:w-[70%] md:w-3/5 md:h-3/5 lg:w-1/2 xl:w-[1290px]">
        <img alt="logo" src={logo}  width={50} height={50}></img>
        <h1 className='text-center font-bold'>Login</h1>
          {!loginData.data.status && <div className='signin-message h-fit py-[15px] px-[5px] text-center text-[red] bg-[#dbafaf]'>{loginData.data.message}</div>}
        <form onSubmit={handleSubmit} className='w-full h-4/5 text-center'> 
          <label htmlFor="email">Email</label>
          <br/>
          <input 
            className='form-text-input'
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            name="email" 
            placeholder="Email"
            autoComplete='off'
            required>
          </input>
          <br/>
          <label htmlFor="password">Password</label>
          <br/>
          <input 
            className='form-text-input'
            type="password" 
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            name="password" 
            placeholder="Password"
            autoComplete='off'
            required>
          </input>
          <br/>
          <input 
              className='bg-[#167fa1] mb-10px font-bold tracking-[2px] hover:bg-[#18647e] hover:text-[rgb(211, 209, 209)'
              type="submit"
              value="Login"/>
        </form>
      </div>
    </div>
  )
}

export default Login;