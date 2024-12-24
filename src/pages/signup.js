import React, { useState } from "react";
import "../css/signup.css"; // CSS for styling
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase.js"; // Directly import auth and db

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    isAdmin: false, // isAdmin is part of the state, it can be updated based on user input or logic
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, username, isAdmin } = formData;

    if (email && password && username) {
      try {
        // Create user with email and password using imported auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Save user to Firestore using imported db
        await db.collection("users").doc(user.uid).set({
          username,
          email,
          isAdmin, // Save the isAdmin state from formData
          createdAt: new Date(),
        });

        setErrorMessage(""); // Clear any previous error messages
        navigate("/"); // Redirect to the home page after successful signup
      } catch (error) {
        console.error("Error during signup:", error.message);
        setErrorMessage(error.message); // Show error message if signup fails
      }
    } else {
      setErrorMessage("Please fill in all fields for signup.");
    }
  };

  return (
    <div className="background-signup">
      <div className="signup-container">
        <h1>Sign up</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
          </div>
          {/* Add other fields for isAdmin if needed (e.g., a checkbox) */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="signup-button">
            Sign up
          </button>
        </form>
        <p className="toggle-message">
          Already have an account?
          <Link to="/log-in">
            <span className="toggle-link">Log In</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
