import './App.css'
import TopMovies from './components/top-movies/top-movies'
import Navbar from './components/navbar/navbar';
import SingleMovie from './components/single-movie/single-movie';
import SingleStar from './components/single-star/single-star';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
		<Navbar/>
		<div className="App">
			<Routes>
				<Route path="/top-movies" element={<TopMovies/>}/>
			</Routes>
			<Routes>
				<Route path="/single-movie" element={<SingleMovie/>}/>
			</Routes>
			<Routes>
				<Route path="/single-star" element={<SingleStar/>}/>
			</Routes>
		</div>
    </>
  );
}

export default App;
