// src/components/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import "../css/homepage.css"; // Optional: Import custom styles for the homepage

const Home = () => {
  return (
    <div className="home-page">
        <div className="home-page-container">
            <h1>Welcome to Popcorn Meter</h1>
            <p>Lights Camera Feedback!!</p>
            <Link to="/add-movie">
                <button className="link-button">Add a Movie</button>
            </Link>
            <Link to="/movies-list">
                <button className="link-button">View Movies</button>
            </Link>
        </div>
    </div>
  );
};

export default Home;
