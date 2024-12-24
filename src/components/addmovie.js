// src/components/AddMovieForm.js
import React, { useState } from "react";
import { db } from "../firebase"; // Import Firestore from firebase.js

import "../css/addmovie.css"; // Import CSS for styling
import { useNavigate } from "react-router-dom";


const AddMovieForm = () => {
  const [movie, setMovie] = useState({
    name: "",
    director: "",
    genre: "",
    year: "",
    poster: "",
    description: "", // Add description to the movie state
  });
  const navigate = useNavigate(); // Use navigate for programmatic navigation


  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Reference the movies collection
      const collectionRef = db.collection("movies");

      // Add movie document to Firestore
      await collectionRef.add({
        name: movie.name,
        director: movie.director,
        genre: movie.genre,
        year: movie.year,
        poster: movie.poster,
        description: movie.description, // Add description to Firestore document
      });

      // Clear the form
      setMovie({
        name: "",
        director: "",
        genre: "",
        year: "",
        poster: "",
        description: "", // Reset description field
      });

      navigate(`/movies-list`); // Use navigate instead of history.push
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  return (
    <div className="background-add">

    <div className="add-movie-container">
      <h1>Add New Movie</h1>
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
          <small>{movie.description.length}/400 characters</small> {/* Display character count */}
        </div>

        <button type="submit" className="submit-button">Add Movie</button>
      </form>
    </div>
    </div>
  );
};

export default AddMovieForm;
