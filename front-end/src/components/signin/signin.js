import React from 'react';
import './signin.css'


const Login = () => {

    return (
        <div className="signin-widget">
            <h1>Sign In</h1>
            <form action="/api/login" method="POST">
                <input type="email" name="email" placeholder="Email"></input>
                <br/>
                <input type="password" name="password" placeholder="Password"></input>
                <br/>
                <input type="submit" value="Sign In"></input>
            </form>
        </div>
    )
}

export default Login;