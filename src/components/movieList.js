import React, { useEffect, useState } from "react";
import { db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import "../css/movieList.css";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [sortField, setSortField] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [userRatings, setUserRatings] = useState({});
  const [loadingMovieId, setLoadingMovieId] = useState(null); // Track the loading state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const navigate = useNavigate();

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

  useEffect(() => {
    fetchMovies();
  }, []);

  const sortMovies = (movies) => {
    return [...movies].sort((a, b) => {
      const valueA =
        sortField === "rating"
          ? a.ratings && a.ratings.length > 0
            ? a.ratings.reduce((acc, val) => acc + val, 0) / a.ratings.length
            : 0
          : a[sortField] || 0;

      const valueB =
        sortField === "rating"
          ? b.ratings && b.ratings.length > 0
            ? b.ratings.reduce((acc, val) => acc + val, 0) / b.ratings.length
            : 0
          : b[sortField] || 0;

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const sortedMovies = sortMovies(movies);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleStarClick = (movieId, rating) => {
    setUserRatings({ ...userRatings, [movieId]: rating });
  };

  const submitRating = async (movieId) => {
    const rating = userRatings[movieId];
    if (!rating) return;

    setLoadingMovieId(movieId); // Set the loading state for the movie

    try {
      const movieRef = db.collection("movies").doc(movieId);
      const movieDoc = await movieRef.get();
      if (movieDoc.exists) {
        const movieData = movieDoc.data();
        const currentRatings = movieData.ratings || [];
        currentRatings.push(rating);

        const newAvgRating =
          currentRatings.reduce((acc, val) => acc + val, 0) /
          currentRatings.length;

        await movieRef.update({
          ratings: currentRatings,
          avgRating: newAvgRating,
        });

        fetchMovies(); // Refresh movie data
        setShowSuccessPopup(true);

        setTimeout(() => {
          setShowSuccessPopup(false); // Hide popup after some time
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setLoadingMovieId(null); // Clear the loading state
    }
  };

  return (
    <div className="background-list">
      <div className="movies-container">
        <h1 className="movies-title">Movies Collection</h1>

        <div className="sort-controls">
          <label htmlFor="sortField" className="sort-controls-label">
            Sort by:
          </label>
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
              setSortOrder((prevOrder) =>
                prevOrder === "asc" ? "desc" : "asc"
              )
            }
          >
            Order: {sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
        {showSuccessPopup && (
          <div className="success-popup">
            <p>Done and Dusted! Your submission was successful!</p>
          </div>
        )}

        <div className="movies-grid">
          {sortedMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={movie.poster || "https://via.placeholder.com/150"}
                alt={`${movie.name} Poster`}
                className="movie-poster"
                onClick={() => handleMovieClick(movie.id)}
                style={{ cursor: "pointer" }}
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
                  <strong>Rating:</strong>{" "}
                  {movie.avgRating ? movie.avgRating.toFixed(2) : "Not Rated"} /
                  5
                </p>
                <hr className="custom-hr" />

                <div className="rating-input">
                  <p style={{ color: "#ffffff" }}>Rate this movie:</p>
                  <div className="star-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <img
                        key={star}
                        src={
                          userRatings[movie.id] >= star
                            ? "/images/full.png"
                            : "/images/empty.png"
                        }
                        alt={`${star} Star`}
                        className="star"
                        onClick={() => handleStarClick(movie.id, star)}
                      />
                    ))}
                  </div>
                  <button
                    className="submit-rating-button"
                    onClick={() => submitRating(movie.id)}
                    disabled={loadingMovieId === movie.id} // Disable button during loading
                  >
                    {loadingMovieId === movie.id
                      ? "Submitting..."
                      : "Submit Rating"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoviesList;
