import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase.js"; // Import auth for current user
import "../css/homepage.css";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null); // State to store the current user data
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin

  useEffect(() => {
    // Track the user's authentication state
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Get the user's role (isAdmin) from Firestore
          const userDoc = await db.collection("users").doc(currentUser.uid).get();
          if (userDoc.exists) {
            setIsAdmin(userDoc.data().isAdmin || false); // Set isAdmin if found, else false
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setIsAdmin(false); // Reset if user is not logged in
      }
    });

    // Cleanup on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const collectionRef = db.collection("movies");
        const response = await collectionRef.get();
        if (!response) {
          throw new Error("Failed to fetch movies");
        }
        const moviesData = response.docs.map((doc) => {
          const data = doc.data();
          const ratings = data.ratings || [];
          const avgRating =
            ratings.length > 0
              ? ratings.reduce((acc, val) => acc + val, 0) / ratings.length
              : 0;

          // Round to 1 decimal place and remove trailing zero
          const formattedRating = avgRating % 1 === 0 ? avgRating.toFixed(0) : avgRating.toFixed(1);

          return {
            id: doc.id,
            ...data,
            avgRating: formattedRating, // Set the formatted rating
          };
        });

        const sortedMovies = moviesData.sort(
          (a, b) => new Date(b.year) - new Date(a.year)
        );
        setMovies(sortedMovies.slice(0, 3)); // Set state with the top 3 movies
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="background-home">
      <div className="home-page">
        <div className="main">
          <div className="home-page-container">
            <h1>Welcome to Popcorn Meter</h1>
            <p>Lights Camera Feedback!!</p>
            {isAdmin && (
              <Link to="/add-movie">
                <button className="link-button">Add a Movie</button>
              </Link>
            )}
            {user &&(
              <Link to="/movies-list">
                <button className="link-button">View Movies</button>
              </Link>
              
            )}
            {!user &&(
              <Link to="/log-in">
                <button className="link-button">Log In to view movies</button>
                >
              </Link>
              
            )}
          </div>
        </div>
        <div className="recent-movies">
          <h2 className="recent">Most Recent Movies</h2>
          <div className="movie-grid">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-cards">
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
                    <strong>Rating:</strong> {movie.avgRating} / 5
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
