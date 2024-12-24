import React, { useState } from "react";
import "../css/login.css"; // Import CSS for styling
import { auth } from "../firebase"; // Import Firebase auth
import { useNavigate } from "react-router-dom"; // For navigation

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // For navigating to other pages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sign in using Firebase Authentication
      await auth.signInWithEmailAndPassword(credentials.email, credentials.password);
      setErrorMessage("");

      // Navigate to the home page on successful login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMessage("Invalid email or password");
    }
  };

  return (
    <div className="background-log">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
