import React from "react";
import "./Footer.css";
import logo from "../../assets/logo/Menu.png"; // change if needed
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* LEFT SECTION */}
        <div className="footer-col footer-brand">
          <img src={logo} alt="Logo" className="footer-logo" />
          <p>
           EasyMove, your full-service courier & logistic partner.
            Fast. Secure. Reliable. You can count on us for your success and growth.
            Experience service like never before.
          </p>

          <div className="footer-social">
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
            <FaLinkedinIn />
          </div>
        </div>

        {/* COMPANY */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li>Contact</li>
            <li>Locations</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* BUSINESS */}
        <div className="footer-col">
          <h4>Business</h4>
          <ul>
            <li>Mission & Vision</li>
            <li>6-D Process</li>
            <li>FAQs</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-col">
          <h4>Get In Touch</h4>
          <p>
          MoveEAsy Building, ,
         Kathmandu, Nepal
          </p>
          <p>sales@easymove.com</p>
          <p>support@easymove.com</p>
          <p>Help Line 1: +977 01-5970736</p>
          <p>Help Line 2: +977 9709155366</p>
          <p>Toll Free: 1810-2733556</p>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        Copyright © 2026 MoveEasy | Powered by Ishaan
      </div>

    </footer>
  );
};

export default Footer;