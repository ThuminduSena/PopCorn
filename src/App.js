import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddMovieForm from './components/addmovie.js';
import MoviesList from './components/movieList.js';
import Home from './pages/home.js';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Routes for pages */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/add-movie" element={<AddMovieForm />} />
          <Route path="/movies-list" element={<MoviesList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;