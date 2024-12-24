import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase.js"; // Import auth to get current user info
import { useNavigate, useParams } from "react-router-dom";
import "../css/moviePage.css";

const MoviePage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalReview, setShowModalReview] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState(null); // Track the review ID for deletion
  const [editReviewText, setEditReviewText] = useState(""); // Track the text for editing
  const [showEditModal, setShowEditModal] = useState(false); // Show/Hide edit modal
  const navigate = useNavigate();
  const user = auth.currentUser; // Get current user

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieDoc = await db.collection("movies").doc(movieId).get();

        if (movieDoc.exists) {
          const movieData = movieDoc.data();
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
      fetchReviews();
    }
  }, [movieId]);

  const fetchReviews = async () => {
    try {
      const reviewsSnapshot = await db
        .collection("movies")
        .doc(movieId)
        .collection("reviews")
        .orderBy("createdAt", "desc")
        .get();

      const reviewsData = reviewsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleEditReview = async () => {
    if (!editReviewText) return; // If text is empty, do nothing

    try {
      await db
        .collection("movies")
        .doc(movieId)
        .collection("reviews")
        .doc(currentReviewId)
        .update({ text: editReviewText });

      fetchReviews(); // Refresh reviews after editing
      setShowEditModal(false); // Close the edit modal
    } catch (error) {
      console.error("Error editing review:", error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to submit a review.");
      return;
    }

    try {
      await db.collection("movies").doc(movieId).collection("reviews").add({
        text: reviewText,
        userEmail: user.email,
        createdAt: new Date(),
      });

      setReviewText("");
      fetchReviews(); // Refresh reviews after adding a new one
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };
  const handleDeleteReview = async () => {
    if (!currentReviewId) return; // Make sure there's a reviewId

    try {
      await db
        .collection("movies")
        .doc(movieId)
        .collection("reviews")
        .doc(currentReviewId)
        .delete();

      fetchReviews(); // Refresh reviews after deletion
      setShowModalReview(false); // Close the delete modal
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

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

  const toggleModalReview = (reviewId) => {
    setCurrentReviewId(reviewId); // Set the current review ID for deletion
    setShowModalReview(!showModalReview);
  };

  const toggleEditModal = (reviewId, reviewText) => {
    setCurrentReviewId(reviewId); // Set the current review ID for editing
    setEditReviewText(reviewText); // Set the current review text for editing
    setShowEditModal(!showEditModal);
  };

  if (!movie) {
    return <p>Loading movie details...</p>;
  }

  return (
    <div className="background-movie">
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

        {/* Delete confirmation modal */}
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

        {/* Review deletion modal */}
        {showModalReview && (
          <div className="modal">
            <div className="modal-content">
              <h3>Are you sure you want to delete this Review?</h3>
              <button onClick={handleDeleteReview} className="confirm-delete">
                Yes, Delete
              </button>
              <button onClick={() => setShowModalReview(false)} className="cancel-delete">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit review modal */}
        {showEditModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Review</h3>
              <textarea
                value={editReviewText}
                onChange={(e) => setEditReviewText(e.target.value)}
              />
              <div>
                <button onClick={handleEditReview} className="confirm-delete">
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="cancel-delete"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Reviews</h2>
          {user && (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review..."
                required
              ></textarea>
              <button type="submit" className="submit-review-button">
                Submit Review
              </button>
            </form>
          )}
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <p>
                <strong>{review.userEmail}</strong>: {review.text}
              </p>
              <small>
                {new Date(review.createdAt.toDate()).toLocaleString()}
              </small>
              {user && user.email === review.userEmail && (
                <div className="review-actions">
                  <button
                    className="edit-button"
                    onClick={() =>
                      toggleEditModal(review.id, review.text)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button2"
                    onClick={() => toggleModalReview(review.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
