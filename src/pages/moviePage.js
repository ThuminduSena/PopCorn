import React, { useEffect, useState } from "react";
import { db } from "../firebase.js";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams to get the movie ID from the URL
import "../css/moviePage.css"; // Import your styling (optional)

const MoviePage = () => {
  const { movieId } = useParams(); // Destructure movieId from useParams
  const [movie, setMovie] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for the delete confirmation modal
  const navigate = useNavigate(); // Use navigate for programmatic navigation

  useEffect(() => {
    // Function to fetch movie details from Firestore
    const fetchMovieDetails = async () => {
      try {
        const movieDoc = await db.collection("movies").doc(movieId).get(); // Correctly use movieId

        if (movieDoc.exists) {
          setMovie({ id: movieDoc.id, ...movieDoc.data() });
        } else {
          console.error("No such movie!");
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    if (movieId) {
      // Check if movieId exists before making the API call
      fetchMovieDetails();
    }
  }, [movieId]); // Make sure the effect reruns when movieId changes

  // Function to generate stars based on the rating (with 0.25, 0.5, 0.75)
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // Number of full stars (integer part of rating)
    const halfStar = rating % 1 >= 0.5 && rating % 1 < 0.75 ? 1 : 0; // Half star
    const quarterStar = rating % 1 >= 0.25 && rating % 1 < 0.5 ? 1 : 0; // Quarter star
    const threeQuarterStar = rating % 1 >= 0.75 ? 1 : 0; // Three-quarter star

    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<img src="/images/full.png" alt="Full Star" key={i} />); // Full star
      } else if (i === fullStars && threeQuarterStar) {
        stars.push(
          <img src="/images/threeQuater.png" alt="Three Quarter Star" key={i} />
        ); // Three-quarter star
      } else if (i === fullStars && halfStar) {
        stars.push(<img src="/images/half.png" alt="Half Star" key={i} />); // Half star
      } else if (i === fullStars && quarterStar) {
        stars.push(<img src="/images/quater.png" alt="Quarter Star" key={i} />); // Quarter star
      } else {
        stars.push(<img src="/images/empty.png" alt="Empty Star" key={i} />); // Empty star
      }
    }
    return stars;
  };

  const getRatingClass = (rating) => {
    if (rating <= 2) {
      return "low-rating"; // Red for low ratings
    } else if (rating > 2 && rating <= 4) {
      return "mid-rating"; // Yellow for mid-range ratings
    } else {
      return "high-rating"; // Green for high ratings
    }
  };

  const handleUpdate = () => {
    // Redirect to the UpdateMovie page
    navigate(`/update-movie/${movieId}`);
  };

  const handleDelete = async () => {
    try {
      await db.collection("movies").doc(movieId).delete();
      navigate("/movies-list"); // Redirect to the movies list page after deletion
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  // Toggle modal visibility
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

          {/* Star Rating Section */}

          <p>
            <strong>Description:</strong> {movie.description}
          </p>
        </div>
        <div className="star-rating-section">
          <h3 className="star-rating-h3">Rating</h3>
          <div className={`rating-number ${getRatingClass(movie.rating)}`}>
            {movie.rating} / 5
          </div>
          <div className="star-rating">
            {renderStars(movie.rating).map((star, index) => (
              <span key={index} className="star">
                {star}
              </span>
            ))}
          </div>
          {/* Update and Delete buttons */}
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

      {/* Modal for delete confirmation */}
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
