import React, { useState, createContext } from 'react';
import axios from 'axios';
import './App.css';
import Home from './components/home/home';
// import Login from './components/signin/signin';
import TopMovies from './components/top-movies/top-movies';
import Navbar from './components/navbar/navbar';
import SingleMovie from './components/single-movie/single-movie';
import SingleStar from './components/single-star/single-star';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import MoviesResult from './components/movies-result/movies-result';
import CartProvider from './contexts/CartContext';
import ShoppingCart from './components/shopping-cart/cart';
import CheckoutSuccess from './components/checkout/checkout-success'

const SessionContext = createContext();

function App() {
	const { isAuthenticated, loginWithRedirect } = useAuth0();

	const [mySession, setSession] = useState({});

	axios.defaults.withCredentials = true;

	return (
		<CartProvider>
		<Routes>
			<Route path="/" element={<Navbar/>}>
				<Route path="/" element={<Home/>}/>
				<Route path="/home" element={<Home/>}/>
				<Route path="/movies" element={<MoviesResult/>}/>
				<Route path="/top-movies" element={<TopMovies/>}/>
				<Route path="/single-movie" element={<SingleMovie/>}/>
				<Route path="/single-star" element={<SingleStar/>}/>
				<Route path="/cart" element={<ShoppingCart/>}/>
				<Route path="/success" element={<CheckoutSuccess/>}/>
			</Route>
		</Routes>
		</CartProvider>	


		// <div className="App">
		// 	<Navbar/>
		// 	<div className="content">
		// 		<Routes>
		// 			<Route path="/" element={<Navbar/>}>
		// 				<Route path="/home" element={<Home/>}/>
		// 				<React.Fragment>
		// 					<Route path="/movies" element={<MoviesResult/>}/>
		// 					<Route path="/top-movies" element={<TopMovies/>}/>
		// 					<Route path="/single-movie" element={<SingleMovie/>}/>
		// 					<Route path="/single-star" element={<SingleStar/>}/>
		// 					<Route path="/cart" element={<ShoppingCart/>}/>
		// 					<Route path="/success" element={<CheckoutSuccess/>}/>
		// 				</React.Fragment>
		// 			</Route>
		// 		</Routes>
		// 	</div>
		// </div>
	);
}

export {App, SessionContext};
