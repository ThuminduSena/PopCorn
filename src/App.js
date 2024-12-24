import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddMovieForm from './components/addmovie.js';
import MoviesList from './components/movieList.js';
import Home from './pages/home.js';
import MoviePage from './pages/moviePage.js';
import UpdateMovieForm from './pages/updateMovie.js';
import Navbar from './components/navbar.js';
import LoginPage from './pages/login.js';
import Auth from './pages/signup.js';

function App() {
  return (
    <Router>
      <div className="App">
      <Navbar />
      <div>
        {/* Routes for pages */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/add-movie" element={<AddMovieForm />} />
          <Route path="/movies-list" element={<MoviesList />} />
          <Route path="/movie/:movieId" element={<MoviePage />} /> 
          <Route path="/update-movie/:movieId" element={<UpdateMovieForm />} />

          <Route path="/log-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<Auth />} />  

        </Routes>
        
      </div>
      </div>
    </Router>
  );
}

export default App;
