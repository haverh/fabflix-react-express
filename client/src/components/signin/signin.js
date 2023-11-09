import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { SessionContext } from '../../App.js';
import './signin.css';

// const axios = require('axios');

const Login = () => {

    const { mySession, setSession } = useContext(SessionContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const fetchURL = process.env.REACT_APP_VERCEL_FETCH_URL;
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
        Axios.post(`${fetchURL}/api/login`, {
            email: email,
            password: password,
        })
        .then((res) => {
            setSession(res.data);
            if (res.data.status) {
                console.log(res.data);
                window.location.href = "top-movies";
            } else {
                console.log(res.data);
            }
        }
        )
        // e.preventDefault(); 
        // console.log(e.target.email.value, e.target.password.value);
        // try {
        //     const response = await fetch('http://localhost:5000/api/login', {
        //         method: "POST",
        //         headers: {'Content-Type': 'application/json'},
        //         body: JSON.stringify({
        //             email: e.target.email.value,
        //             password: e.target.password.value
		// 	    })
        //     });
        //     const jsonData = await response.json();
        //     props.setSession(jsonData);
        //     // setEmail("");
        //     // setPassword("");
        //     setStatus(jsonData.status);
        //   } catch (error) {
        //     console.error('Error fetching data:', error);
        // }
    };

    return (
        <div className="signin-widget">
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
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
                <input type="submit" value="Sign In"></input>
                <div className="signin-message">{mySession.message}</div>
            </form>
        </div>
    )
}

export default Login;