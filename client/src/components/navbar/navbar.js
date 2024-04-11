import React, { useState, useContext, Suspense } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom'
import './navbar.css'
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Navbar as NB, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCartShopping, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import FulltextInput from '../fulltext-search/fulltext';
import { CartContext } from '../../contexts/CartContext';

import handleLogout from '../account/logout';
import UserMenuImage from '../account/user';

// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import {Navbar as NB} from 'react-bootstrap/Navbar';

// Logo
import logo from '../../img/logo_transparent.png';

const Navbar = () => {
  const cart = useContext(CartContext);

  return (
    <>
    <NB expand="lg" className="bg-grey shadow-sm w-100">
      <NB.Brand className="logo" to="/home">
        <Link className="navbar-brand" to="/home"><img src={logo} alt='logo' width={50} height={50}/>
          Gotcha Movies
        </Link>
      </NB.Brand>
      <NB.Toggle aria-controls="basic-navbar-nav" />
      <NB.Collapse id="basic-navbar-nav">
        <Nav className="me-auto align-items-end h-100">
          <Nav.Link to="/home" as={NavLink} className='nav-link'>Home</Nav.Link>
          <Nav.Link to="/top-movies" as={NavLink} className='nav-link'>Top Movies</Nav.Link>
        </Nav>
        <div className="d-flex justify-content-end align-items-center h-100">
          <FulltextInput className="me-auto"/>
          {/* <ul className="d-flex justify-center-end align-items-end h-100 navbar-nav loggingButtons">
            <li><button onClick={() => loginWithRedirect()}>Login</button></li>
            <li><button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</button></li>
          </ul> */}
          <Nav.Link to="/cart" as={NavLink} className='cartButton' name='cart'>
            <FontAwesomeIcon icon={faCartShopping} /><span>{cart.items.length}</span>
          </Nav.Link>
          <NavDropdown title={UserMenuImage} align="end">
            <NavDropdown.Item href="#action/3.1" className='dropdown-item'>
              <div className='dropdown-thingy'>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <span>Profile</span>
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout} className='dropdown-item'>
              <div className='dropdown-thingy'>
                <FontAwesomeIcon icon={faRightFromBracket} />
              </div>
              <span>Logout</span>
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      </NB.Collapse>
    </NB>
    <Suspense fallback={<h1>Loading...</h1>}>
      <Outlet/>
    </Suspense>
    </>
  )
}

export default Navbar;