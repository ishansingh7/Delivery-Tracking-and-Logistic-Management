import React, { useEffect, useState } from "react";
import "./Navbar.css";
import image from "../../assets/logo/Menu.png";




const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      {/* RIGHT LINKS */}
      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <a href="/">Home</a>
        <a href="/About">About</a>
        <a href="/Services">Services</a>
        <a href="/contact">Contact</a>
        <a href="#">Locations</a>
        <a href="#">Jobs</a>
         <a href="http://localhost:5174">Admin</a>
        <a href="http://localhost:5173">Logistic</a>
        <button className="track-btn">TRACK</button>
      </nav>
    </header>
  );
};

export default Navbar;
