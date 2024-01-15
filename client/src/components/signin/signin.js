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
    // const [myStatus, setMyStatus] = useState();

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
                window.location.href = "home";
            } else {
                console.log("LOGIN UNSUCCESSUL", res.data);
            }
        }
        )
    };

    return (
        <div className='login-content'>
            <div className="signin-widget">
                <img alt="logo" src={logo}  width={50} height={50}></img>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}> 
                    <label htmlFor="email">Email</label>
                    <br/>
                    <input 
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
                    <input type="submit" value="Login"/>
                    {/* <div className="signin-message">{mySession.message}</div> */}
                </form>
            </div>
        </div>
    )
}

export default Login;