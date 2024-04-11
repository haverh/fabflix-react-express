import React, { lazy, Suspense  } from 'react';
import axios from 'axios';
import './App.css';
// import Home from './components/home/home';
// import Login from './components/signin/signin';
// import TopMovies from './components/top-movies/top-movies';
// import Navbar from './components/navbar/navbar';
// import SingleMovie from './components/single-movie/single-movie';
// import SingleStar from './components/single-star/single-star';
import { Routes, Route, Switch } from 'react-router-dom';
// import { useAuth0 } from "@auth0/auth0-react";
// import MoviesResult from './components/movies-result/movies-result';
// import CartProvider from './contexts/CartContext';
// import ShoppingCart from './components/shopping-cart/cart';
// import CheckoutSuccess from './components/checkout/checkout-success';

const Home = lazy(() => import('./components/home/home'))
const Login = lazy(() => import('./components/account/login'))
const TopMovies = lazy(() => import('./components/top-movies/top-movies'))
const Navbar = lazy(() => import('./components/navbar/navbar'))
const SingleMovie = lazy(() => import('./components/single-movie/single-movie'))
const SingleStar = lazy(() => import('./components/single-star/single-star'))
const MoviesResult = lazy(() => import('./components/movies-result/movies-result'))
const CartProvider = lazy(() => import('./contexts/CartContext'))
const ShoppingCart = lazy(() => import('./components/shopping-cart/cart'))
const CheckoutSuccess = lazy(() => import('./components/checkout/checkout-success'))

// Admin Pages
const AdminNavbar = lazy(() => import('./components/admin-pages/admin-navbar'))
const AdminLogin = lazy(() => import('./components/admin-pages/admin-login'))
const AdminHome = lazy(() => import ('./components/admin-pages/admin-home'))
const AddMovie = lazy(() => import('./components/admin-pages/add-movie'))
const AddStar = lazy(() => import('./components/admin-pages/add-star'))
const AddGenre = lazy(() => import('./components/admin-pages/add-genre'))

function App() {
	// const {loginWithRedirect } = useAuth0();

	// const [mySession, setSession] = useState({});

	axios.defaults.withCredentials = true;
	console.log("APP")

	return (
		<CartProvider>
			<Routes>
				<Route path="/login" element={<Login/>}/>
				<Route path="/admin/login" element={<AdminLogin/>}></Route>
				<Route path="/admin/" element={<AdminNavbar/>}>
					<Route path='/admin/' element={<AdminHome/>}></Route>
					<Route path='/admin/home' element={<AdminHome/>}></Route>
					<Route path="/admin/add-movie" element={<AddMovie/>}/>
					<Route path="/admin/add-star" element={<AddStar/>}/>
					<Route path="/admin/add-genre" element={<AddGenre/>}/>
				</Route>
				
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
	);
}

export {App};
