import React from 'react';
import { Link } from 'react-router-dom';
import "../css/navbar.css"; // Import CSS for styling

const Navbar = () => {
  
  return (
    <nav className={`navbar`} >
      <div >
        <Link to="/"><img className="Navlogo" src='/images/logo.png' alt='logo'/></Link>
      </div>
      <div className="nav-links">
        <Link to="/log-in">Log in</Link>
        <Link to="/sign-up">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
