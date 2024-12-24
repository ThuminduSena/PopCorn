import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "./firebase"; // Import Firebase auth

const ProtectedRoute = ({ element }) => {
  const user = auth.currentUser; // Get the current authenticated user
  const [isAdmin, setIsAdmin] = useState(null); // Use null for loading state

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const userDoc = await db.collection("users").doc(user.uid).get();
          setIsAdmin(userDoc.exists ? userDoc.data().isAdmin : false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (isAdmin === null) {
    return <div>Loading...</div>; // Show loading indicator while checking admin status
  }

  if (user && isAdmin) {
    return element; // Render the protected element if user is admin
  } else if (user) {
    return <Navigate to="/" replace />; // Redirect to homepage for non-admin users
  } else {
    return <Navigate to="/log-in" replace />; // Redirect to login for unauthenticated users
  }
};

export default ProtectedRoute;
