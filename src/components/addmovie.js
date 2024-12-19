// src/components/AddMovieForm.js
import React, { useState } from "react";
import { db } from "../firebase"; // Import Firestore from firebase.js

import "../css/addmovie.css" // Import CSS for styling

const AddMovieForm = () => {
  const [movie, setMovie] = useState({
    name: "",
    director: "",
    genre: "",
    year: "",
    rating: "",
    poster: "",
  });

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
        rating: movie.rating,
        poster: movie.poster,
      });

      // Clear the form
      setMovie({
        name: "",
        director: "",
        genre: "",
        year: "",
        rating: "",
        poster: "",
      });

      alert("Movie added successfully!");
    } catch (error) {
      console.error("Error adding movie:", error);
      alert("Failed to add movie.");
    }
  };

  return (
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
                min="1900" // Optional: restrict year range
                max={new Date().getFullYear()} // Optional: restrict to current year
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
            step="0.1"  // Allows decimal points for float values
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
        <button type="submit" className="submit-button">Add Movie</button>
      </form>
    </div>
  );
};

export default AddMovieForm;
