import React from 'react';
import { Link } from 'react-router-dom'
import './navbar.css'

const Navbar = () => {
    return (
        <div className="nav-section" >
            <nav className="navbar navbar-expand-lg navbar-light">
                <a className="navbar-brand" href="#">Gotcha Movie</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">

                    <li className="nav-item active">
                        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/top-movies">Top Movies</Link>
                    </li>
                    </ul>
                </div>
                <div className="search-component">
                    <form id="full-text-form" action="#" method="GET">
                        <input className="search-item" type="text" id="full-text" name="full-text" placeholder="Full Text Search"/>
                        <button type="submit"><i className="fa fa-search"></i></button>
                    </form>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;