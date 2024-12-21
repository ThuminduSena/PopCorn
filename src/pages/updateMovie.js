import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Import Firestore from firebase.js
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation

import "../css/addmovie.css"; // Import CSS for styling

const UpdateMovieForm = () => {
  const { movieId } = useParams(); // Get the movieId from the URL params
  const navigate = useNavigate(); // Use navigate to redirect after updating
  const [movie, setMovie] = useState({
    name: "",
    director: "",
    genre: "",
    year: "",
    rating: "",
    poster: "",
    description: "", // Add description to the movie state
  });

  useEffect(() => {
    // Fetch movie details based on movieId
    const fetchMovieDetails = async () => {
      try {
        const movieDoc = await db.collection("movies").doc(movieId).get();
        if (movieDoc.exists) {
          setMovie({ id: movieDoc.id, ...movieDoc.data() }); // Set movie data to form
        } else {
          console.error("No such movie!");
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [movieId]); // Fetch movie details when movieId changes

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  // Handle form submission (update movie)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Reference the movie document in Firestore
      const movieRef = db.collection("movies").doc(movieId);

      // Update movie document in Firestore
      await movieRef.update({
        name: movie.name,
        director: movie.director,
        genre: movie.genre,
        year: movie.year,
        rating: movie.rating,
        poster: movie.poster,
        description: movie.description, // Update description
      });

      // Redirect to the movie page after updating
      navigate(`/movie/${movieId}`); // Use navigate instead of history.push

    } catch (error) {
      console.error("Error updating movie:", error);
      alert("Failed to update movie.");
    }
  };

  return (
    <div className="add-movie-container">
      <h1>Update Movie</h1>
      <form onSubmit={handleSubmit} className="add-movie-form">
        <div className="form-group">
          <label htmlFor="name">Movie Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={movie.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="director">Director:</label>
          <input
            type="text"
            id="director"
            name="director"
            value={movie.director}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={movie.genre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">Release Year:</label>
          <input
            type="number"
            id="year"
            name="year"
            value={movie.year}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear()}
            placeholder="Enter the year (e.g., 2023)"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rating">Rating (out of 5):</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={movie.rating}
            onChange={handleChange}
            step="0.1"
            max="5"
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="poster">Poster URL:</label>
          <input
            type="text"
            id="poster"
            name="poster"
            value={movie.poster}
            onChange={handleChange}
            required
          />
        </div>

        {/* New Description Field */}
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={movie.description}
            onChange={handleChange}
            maxLength="400" // Limit description to 400 characters
            placeholder="Enter movie description..."
            required
          />
          <small>{movie.description ? movie.description.length : 0}/400 characters</small> {/* Display character count */}
        </div>

        <button type="submit" className="submit-button">Update Movie</button>
      </form>
    </div>
  );
};

export default UpdateMovieForm;
