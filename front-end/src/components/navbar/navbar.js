import React from 'react';
import { Link, Outlet } from 'react-router-dom'
import './navbar.css'
import { useAuth0 } from "@auth0/auth0-react";

// Logo
import logo from '../../img/logo_transparent-2.png';

const Navbar = () => {
    const { loginWithRedirect, logout } = useAuth0();
    return (
        <div className="nav-section" >
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="logo">
                    <Link className="navbar-brand" to="/home"><img src={logo} alt='logo' width={50} height={50}/>Gotcha Movies</Link>
                </div>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">

                        <li className="nav-item">
                            <Link className="nav-link" to="/home">Home </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/top-movies">Top Movies</Link>
                        </li>
                    </ul>
                </div>
                <div className="search-component">
                    {/* <form id="full-text-form" action="#" method="GET">
                        <input className="search-item" type="text" id="full-text" name="full-text" placeholder="Full Text Search"/>
                        <button type="submit"><i className="fa fa-search"></i></button>
                    </form> */}
                    <form className="d-flex input-group w-auto">
                        <input
                            type="search"
                            className="form-control rounded"
                            placeholder="Search"
                            aria-label="Search"
                            aria-describedby="search-addon"
                        />
                        <span className="input-group-text text-white border-0" id="search-addon">
                            <i className="fa fa-search"></i>
                        </span>
                        </form>
                </div>
                <ul className="navbar-nav mr-auto">
                    <li><button onClick={() => loginWithRedirect()}>Login</button></li>
                    <li><button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</button></li>
                </ul>
            </nav>
            <Outlet/>
        </div>
        
    )
}

export default Navbar;