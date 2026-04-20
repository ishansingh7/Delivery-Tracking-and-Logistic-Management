import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import image from "../../assets/logo/Menu.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking a link
  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      
      {/* LEFT SECTION */}
      <div className="nav-left-section">
        <div className="logo">
          <img src={image} alt="Logo" />
        </div>

        <div className="nav-left">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
          <button className="search-btn">Search</button>
        </div>
      </div>

      {/* HAMBURGER ICON */}
      <div
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* NAV LINKS */}
      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        
        <Link to="/" onClick={handleNavClick}>Home</Link>
        <Link to="/about" onClick={handleNavClick}>About</Link>
        <Link to="/services" onClick={handleNavClick}>Services</Link>
        <Link to="/contact" onClick={handleNavClick}>Contact</Link>
       
        {/* External Links */}
        <a href="https://delivery-tracking-and-logistic-mana-ten.vercel.app" target="_blank" rel="noreferrer">
          Admin
        </a>
        <a href="https://delivery-tracking-and-logistic-mana-gamma.vercel.app" target="_blank" rel="noreferrer">
          Logistic
        </a>

        {/* Start Service Button */}
        <button
          className="track-btn"
          onClick={() => {
            handleNavClick();
            navigate("/servicesDelibery");
          }}
        >
          Start Service
        </button>

      </nav>
    </header>
  );
};

export default Navbar;