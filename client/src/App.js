import React, { lazy, useState, useEffect, } from 'react';
import Axios from 'axios';
import './App.css';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';

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
const Loading = lazy(() => import('./components/loading/loading'));
const UnauthorizedPage = lazy(() => import('./components/loading/unauthorized'));

// Admin Pages
const AdminNavbar = lazy(() => import('./components/admin-pages/admin-navbar'))
const AdminHome = lazy(() => import ('./components/admin-pages/admin-home'))
const AddMovie = lazy(() => import('./components/admin-pages/add-movie'))
const AddStar = lazy(() => import('./components/admin-pages/add-star'))
const AddGenre = lazy(() => import('./components/admin-pages/add-genre'))

// // const fetchURL = process.env.REACT_APP_VERCEL_FETCH_URL;
const fetchURL = process.env.REACT_APP_LOCAL_FETCH_URL;

const isAuthenticated = async () => {
	try {
		const res = await Axios.get(`${fetchURL}/api/authorization`, {
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json'
			}
		});
		
		if (res.status === 401) {
			window.location.href = "/login";
		}
		return res.data.role;

	} catch (error) {
		console.error("Error:", error);
		return null;
	}
};

const ProtectedRoute = () => {
	const [role, setRole] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
    const fetchRole = async () => {
      const _role = await isAuthenticated();
      setRole(_role);
			setLoading(false);
    };
    fetchRole();
  }, []);

	return (
		loading ? <Loading /> :
		(role === 'admin') ? <Outlet /> : <UnauthorizedPage/>
	)
};


const App = () => {
	
	Axios.defaults.withCredentials = true;

	return (
		<CartProvider>
			<Routes>
				<Route path="/login" element={<Login/>}/>
				<Route element={<ProtectedRoute />}>
					<Route path="/admin/" element={<AdminNavbar/>}>
						<Route path='/admin/' element={<AdminHome/>}></Route>
						<Route path='/admin/home' element={<AdminHome/>}></Route>
						<Route path="/admin/add-movie" element={<AddMovie/>}/>
						<Route path="/admin/add-star" element={<AddStar/>}/>
						<Route path="/admin/add-genre" element={<AddGenre/>}/>
					</Route>
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
