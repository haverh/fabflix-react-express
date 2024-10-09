import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './login.css';

import fetchURL from '../../config.js';

import logo from '../../img/logo_transparent.png';

const NormalLogin = () => {
  const navigate = useNavigate();
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
        navigate("/home");
      }
    }).catch(err => {
      console.log(err.response.data);
      setLoginData(err.response.data);
    })
  };

  return (
      <div className="signin-widget">
        <img alt="logo" src={logo}  width={75} height={75}></img>
        <h1>Login</h1>
          {!loginData.data.status && <div className='signin-message'>{loginData.data.message}</div>}
        <form onSubmit={handleSubmit}> 
          <label htmlFor="email" className='form-label'>Email</label>
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
          <label htmlFor="password" className='form-label'>Password</label>
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
              className='form-submit-btn'
              type="submit"
              value="Login"/>
        </form>
      </div>
  )
}

const AdminLogin = () => {
  const navigate = useNavigate();
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
        navigate("/home");
      }
    }).catch(err => {
      console.log(err.response.data);
      setLoginData(err.response.data);
    })
  };

  return (
    <div className="signin-widget">
      <img alt="logo" src={logo}  width={75} height={75}></img>
      <h1>Admin Login</h1>
        {!loginData.data.status && <div className='signin-message'>{loginData.data.message}</div>}
      <form onSubmit={handleSubmit}> 
        <label htmlFor="email" className='form-label'>Email</label>
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
        <label htmlFor="password" className='form-label'>Password</label>
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
            className='form-submit-btn'
            type="submit"
            value="Login"/>
      </form>
    </div>
  )
}

const Login = () => {
  const [adminLogin, setAdminLogin] = useState(false)

  return (
    <div className='h-screen flex justify-center items-center p-2'>
      <div>
        <div className='bg-[#062463] rounded mb-2'>
          <button onClick={() => setAdminLogin(false)} className={`login-switch ${!adminLogin && 'bg-[#0B3E8F]'}`}>Customer</button>
          <button onClick={() => setAdminLogin(true)} className={`login-switch ${adminLogin && 'bg-[#0B3E8F]'}`}>Admin</button>
        </div>
        {adminLogin ? <AdminLogin /> : <NormalLogin />}
      </div>
    </div>
  )
}


export default Login;