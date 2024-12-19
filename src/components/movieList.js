// src/components/MovieList.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase.js";
import "../css/movieList.css"; // Import external CSS file

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [sortField, setSortField] = useState("rating"); // Default sort field
  const [sortOrder, setSortOrder] = useState("desc"); // Default sort order

  // Function to fetch movies from Firestore
  const fetchMovies = async () => {
    try {
      const collectionRef = db.collection("movies");
      const snapshot = await collectionRef.get();

      const moviesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMovies(moviesData);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Function to sort movies based on the selected field and order
  const sortMovies = (movies) => {
    return [...movies].sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });
  };

  // Fetch movies when the component mounts
  useEffect(() => {
    fetchMovies();
  }, []);

  // Sort movies dynamically whenever sortField or sortOrder changes
  const sortedMovies = sortMovies(movies);

  return (
    <div className="background">

    <div className="movies-container">
      <h1 className="movies-title">Movies Collection</h1>
      {/* Sort Controls */}
      <div className="sort-controls">
     <label htmlFor="sortField" className="sort-controls-label">Sort by:</label>
      <select
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="rating">Rating</option>
          <option value="year">Year</option>
          <option value="name">Name</option>
        </select>
        <button
          onClick={() =>
            setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"))
          }
        >
          Order: {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>

      {/* Movies Grid */}
      <div className="movies-grid">
        {sortedMovies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={movie.poster || "https://via.placeholder.com/150"}
              alt={`${movie.name} Poster`}
              className="movie-poster"
            />
            <div className="movie-info">
              <h3 className="movie-name">{movie.name}</h3>
              <p className="movie-detail">
                <strong>Director:</strong> {movie.director}
              </p>
              <p className="movie-detail">
                <strong>Genre:</strong> {movie.genre}
              </p>
              <p className="movie-detail">
                <strong>Year:</strong> {movie.year}
              </p>
              <p className="movie-detail">
                <strong>Rating:</strong> {movie.rating}/5
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default MoviesList;
