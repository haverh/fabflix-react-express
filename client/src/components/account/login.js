import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { SessionContext } from '../../App.js';
import './login.css';

import fetchURL from '../../config.js';

import logo from '../../img/logo_transparent.png';

const NormalLogin = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loginData, setLoginData] = useState({data: {status: true}});

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
      <div className="signin-widget flex flex-col items-center min-w-[300px] max-w-[350px] h-1/2 p-[10px] bg-[#041C32] rounded-[10px] sm:w-[70%] md:w-3/5 lg:w-1/2 xl:w-[1290px]">
        <img alt="logo" src={logo}  width={75} height={75}></img>
        <h1 className='text-center font-bold'>Login</h1>
          {!loginData.data.status && <div className='signin-message h-fit py-[15px] px-[5px] text-center text-[red] bg-[#dbafaf]'>{loginData.data.message}</div>}
        <form onSubmit={handleSubmit} className='w-full h-auto mb-5 text-center'> 
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
  )
}

const AdminLogin = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loginData, setLoginData] = useState({data: {status: true}});

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    Axios.post(`${fetchURL}/api/admin/login`, {
      email: email,
      password: password,
    })
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        console.log("ADMIN LOGIN SUCCESSUL", res.data);
        setLoginData(res.data);
        window.location.href = "../home";
      }
    }).catch(err => {
      console.log(err.response.data);
      setLoginData(err.response.data);
    })
  };

  return (
    <div className="signin-widget flex flex-col items-center min-w-[300px] max-w-[350px] h-1/2 p-[10px] rounded-[10px] sm:w-[70%] md:w-3/5 lg:w-1/2 xl:w-[1290px]">
      <img alt="logo" src={logo}  width={75} height={75}></img>
      <h1 className='text-center font-bold mb-4'>Admin Login</h1>
        {!loginData.data.status && <div className='signin-message h-fit py-[15px] px-[5px] text-center text-[red] bg-[#dbafaf]'>{loginData.data.message}</div>}
      <form onSubmit={handleSubmit} className='w-full h-auto mb-5 text-center'> 
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
  )
}

const Login = () => {
  const [adminLogin, setAdminLogin] = useState(false)

  return (
    <>
    <div className='h-full flex flex-col justify-center items-center'>
      <div className='min-w-[300px] min-w-[350px] bg-[#062463] rounded mb-2'>
        <button onClick={() => setAdminLogin(false)} className={`w-1/2 p-2 rounded hover:bg-[#08296e] ${!adminLogin && 'bg-[#0B3E8F]'}`}>Customer</button>
        <button onClick={() => setAdminLogin(true)} className={`w-1/2 p-2 rounded hover:bg-[#08296e] ${adminLogin && 'bg-[#0B3E8F]'}`}>Admin</button>
      </div>
      {adminLogin ? <AdminLogin /> : <NormalLogin />}
    </div>
    </>
  )
}


export default Login;