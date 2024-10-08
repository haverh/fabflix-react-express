import React, {  Suspense } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Navbar as NB, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';

import './admin-navbar.css';

import handleLogout from '../account/logout';
import UserMenuImage from '../account/user';

import logo from '../../img/logo_transparent.png';

const AdminNavbar = () => {
  return(
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
            <Nav.Link to="/admin/home" as={NavLink} className='nav-link'>Home</Nav.Link>
            <Nav.Link to="/admin/add-movie" as={NavLink} className='nav-link'>Add Movie</Nav.Link>
            <Nav.Link to="/admin/add-star" as={NavLink} className='nav-link'>Add Star</Nav.Link>
            <Nav.Link to="/admin/add-genre" as={NavLink} className='nav-link'>Add Genre</Nav.Link>
          </Nav>
          <div className="d-flex justify-content-end align-items-center h-100">
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

export default AdminNavbar;