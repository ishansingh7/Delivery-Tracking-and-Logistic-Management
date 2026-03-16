import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">

      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Have questions about your delivery? Our logistics team is here to help you 24/7.</p>
      </div>

      <div className="contact-container">

        {/* Contact Form */}
        <div className="contact-form">
          <h2>Send Message</h2>

          <form>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email Address" required />
            <input type="text" placeholder="Tracking ID (Optional)" />

            <textarea placeholder="Your Message"></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="contact-info">
          <h2>Contact Information</h2>

          <div className="info-box">
            <h3>📍 Address</h3>
            <p>MoveEAsy Building, , Kathmandu, Nepal</p>
          </div>

          <div className="info-box">
            <h3>📞 Phone</h3>
            <p>+91 98765 43210</p>
          </div>

          <div className="info-box">
            <h3>📧 Email</h3>
            <p>support@moveeasy.com</p>
          </div>

          <div className="info-box">
            <h3>⏰ Support Hours</h3>
            <p>24/7 Delivery Support</p>
          </div>

        </div>

      </div>

      {/* Map Section */}
      <div className="map-section">
        <iframe
          title="map"
          src="https://www.google.com/maps/embed?pb=!1m18..."
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

    </div>
  );
}

export default Contact;