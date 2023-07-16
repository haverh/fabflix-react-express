import { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import './App.css';
import Login from './components/signin/signin';
import TopMovies from './components/top-movies/top-movies';
import Navbar from './components/navbar/navbar';
import SingleMovie from './components/single-movie/single-movie';
import SingleStar from './components/single-star/single-star';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const SessionContext = createContext();

function App() {
	const { isAuthenticated } = useAuth0();

	const [mySession, setSession] = useState({});
	// const navigate = useNavigate();

	axios.defaults.withCredentials = true;

	// useEffect(() => {
    //     Axios.get("http://localhost:5000/api/login")
	// 	.then( (res) => {
	// 		if ( res.data.signedIn ) {
	// 			setSession(res.data);
	// 			// window.location.href = "/top-movies";
	// 			console.log(`YOU ARE SIGNED IN WITH ${res.data.user.email}`);
	// 		} else {
	// 			console.log("NOT SIGNED IN");
	// 		}
    //     })
    // }, []);

	// const ProtectedRoute = ({ component: Component, ...rest }) => {
	// 	if (!mySession.signedIn) {
	// 		console.log("IN IF")
	// 		console.log(mySession);
	// 		return <Navigate to="/login" replace={true} />;
	// 	}
	  
	// 	  return <Component {...rest}/>;
	// }

	// return (
	// 	<SessionContext.Provider value={{mySession, setSession}}>
	// 		<div className="App">
	// 			<Navbar/>
	// 			<div className="content">
	// 				<Routes>
	// 					<Route path="/login" element={<Login mySession={mySession} setSession={setSession}/>}/>
	// 					<Route path="/top-movies" element={<ProtectedRoute component={TopMovies}/>}/>
	// 					<Route path="/single-movie" element={<ProtectedRoute component={SingleMovie}/>}/>
	// 					<Route path="/single-star" element={<ProtectedRoute component={SingleStar}/>}/>
	// 				</Routes>
	// 			</div>
	// 		</div>
	// 	</SessionContext.Provider>
	// );

	// return (
	// 		<SessionContext.Provider value={{mySession, setSession}}>
	// 			<div className="App">
	// 				<Navbar/>
	// 				<div className="content">
	// 					<Routes>
	// 						<Route path="/login" element={<Login mySession={mySession} setSession={setSession}/>}/>
	// 						<Route path="/top-movies" element={<ProtectedRoute component={TopMovies}/>}/>
	// 						<Route path="/single-movie" element={<ProtectedRoute component={SingleMovie}/>}/>
	// 						<Route path="/single-star" element={<ProtectedRoute component={SingleStar}/>}/>
	// 					</Routes>
	// 				</div>
	// 			</div>
	// 		</SessionContext.Provider>
	// 	);

	return (
		<SessionContext.Provider value={{mySession, setSession}}>
			<div className="App">
				<Navbar/>
				<div className="content">
					<Routes>
						{isAuthenticated
						? (<>
						<Route path="/top-movies" element={<TopMovies/>}/>
						<Route path="/single-movie" element={<SingleMovie/>}/>
						<Route path="/single-star" element={<SingleStar/>}/></>)
						: <></>
						}
					</Routes>
				</div>
			</div>
		</SessionContext.Provider>
	);
}

export {App, SessionContext};
