import React, { useEffect, useState } from "react";
import { db } from "../firebase.js";
import { useNavigate, useParams } from "react-router-dom";
import "../css/moviePage.css";

const MoviePage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieDoc = await db.collection("movies").doc(movieId).get();

        if (movieDoc.exists) {
          const movieData = movieDoc.data();
          // Calculate average rating
          const ratings = movieData.ratings || [];
          const avgRating =
            ratings.length > 0
              ? ratings.reduce((acc, val) => acc + val, 0) / ratings.length
              : 0;

          setMovie({ id: movieDoc.id, ...movieData, avgRating });
        } else {
          console.error("No such movie!");
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 && rating % 1 < 0.75 ? 1 : 0;
    const quarterStar = rating % 1 >= 0.25 && rating % 1 < 0.5 ? 1 : 0;
    const threeQuarterStar = rating % 1 >= 0.75 ? 1 : 0;

    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<img src="/images/full.png" alt="Full Star" key={i} />);
      } else if (i === fullStars && threeQuarterStar) {
        stars.push(
          <img src="/images/threeQuater.png" alt="Three Quarter Star" key={i} />
        );
      } else if (i === fullStars && halfStar) {
        stars.push(<img src="/images/half.png" alt="Half Star" key={i} />);
      } else if (i === fullStars && quarterStar) {
        stars.push(<img src="/images/quater.png" alt="Quarter Star" key={i} />);
      } else {
        stars.push(<img src="/images/empty.png" alt="Empty Star" key={i} />);
      }
    }
    return stars;
  };

  const getRatingClass = (rating) => {
    if (rating <= 2) {
      return "low-rating";
    } else if (rating > 2 && rating <= 4) {
      return "mid-rating";
    } else {
      return "high-rating";
    }
  };

  const handleUpdate = () => {
    navigate(`/update-movie/${movieId}`);
  };

  const handleDelete = async () => {
    try {
      await db.collection("movies").doc(movieId).delete();
      navigate("/movies-list");
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  if (!movie) {
    return <p>Loading movie details...</p>;
  }

  return (
    <div className="movie-detail-container">
      <h1 className="movie-title">{movie.name}</h1>
      <div className="content">
        <img
          src={movie.poster || "https://via.placeholder.com/150"}
          alt={`${movie.name} Poster`}
          className="movie-detail-poster"
        />
        <div className="movie-detail-info">
          <p>
            <strong>Director:</strong> {movie.director}
          </p>
          <p>
            <strong>Genre:</strong> {movie.genre}
          </p>
          <p>
            <strong>Year:</strong> {movie.year}
          </p>
          <p>
            <strong>Description:</strong> {movie.description}
          </p>
        </div>
        <div className="stars-rating-section">
          <h3 className="stars-rating-h3">Rating</h3>
          <div className={`rating-number ${getRatingClass(movie.avgRating)}`}>
            {movie.avgRating.toFixed(2)} / 5
          </div>
          <div className="stars-rating">
            {renderStars(movie.avgRating).map((star, index) => (
              <span key={index} className="stars">
                {star}
              </span>
            ))}
          </div>
          <div className="movie-action-buttons">
            <button className="update-button" onClick={handleUpdate}>
              Update Movie
            </button>
            <button className="delete-button" onClick={toggleModal}>
              Delete Movie
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to delete this movie?</h3>
            <button onClick={handleDelete} className="confirm-delete">
              Yes, Delete
            </button>
            <button onClick={toggleModal} className="cancel-delete">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviePage;
