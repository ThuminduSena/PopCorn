import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/navbar.css"; // Import CSS for styling
import { auth, db } from "../firebase"; // Import Firebase auth and database

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(""); // State for storing the username
  const navigate = useNavigate();

  // Track authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser); // Update the user state based on authentication status

      if (currentUser) {
        try {
          // Fetch the username from Firestore using the user's UID
          const userDoc = await db.collection("users").doc(currentUser.uid).get();
          if (userDoc.exists) {
            setUsername(userDoc.data().username); // Update the username state
          }
        } catch (error) {
          console.error("Error fetching username:", error.message);
        }
      } else {
        setUsername(""); // Clear username when logged out
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <nav className={`navbar`}>
      <div>
        <Link to="/">
          <img className="Navlogo" src="/images/logo.png" alt="logo" />
        </Link>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <span>Welcome, {username}</span>
            <button
              onClick={async () => {
                try {
                  await auth.signOut();
                  navigate("/log-in");
                } catch (error) {
                  console.error("Error signing out:", error.message);
                }
              }}
              className="logout-button"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/log-in">Log in</Link>
            <Link to="/sign-up">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
