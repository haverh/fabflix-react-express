import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom'
import './navbar.css'
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Navbar as NB, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import FulltextInput from '../fulltext-search/fulltext';

// Logo
import logo from '../../img/logo_transparent-2.png';

const Navbar = () => {
    console.log("NAVBAR")
    const { loginWithRedirect, logout } = useAuth0();
    return (
        <>
        <NB className='bg-grey shadow-sm w-100'>
            <Container fluid className='w-100'>
                <Nav className="align-items-center">
                    <div className="logo">
                        <Link className="navbar-brand" to="/home"><img src={logo} alt='logo' width={50} height={50}/>Gotcha Movies</Link>
                    </div>
                    <Nav.Link to="/home" as={NavLink} className='nav-link'>Home</Nav.Link>
                    <Nav.Link to="/top-movies" as={NavLink} className='nav-link'>Top Movies</Nav.Link>
                </Nav>
                <div className="d-flex justify-content-end align-items-center h-100">
                    <FulltextInput />
                    <ul className="navbar-nav loggingButtons">
                        <li><button onClick={() => loginWithRedirect()}>Login</button></li>
                        <li><button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</button></li>
                    </ul>
                    <Nav.Link to="/cart" as={NavLink}><button className='cartButton'><FontAwesomeIcon icon={faCartShopping} /></button></Nav.Link>
                </div>
            </Container>
        </NB>
        <Outlet/>
        </>
    )
}

export default Navbar;