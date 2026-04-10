import React, { useState } from "react";
import "./Home.css";
import heroImage from "./photo/DeliveryBoy.png";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [trackingId, setTrackingId] = useState("");
  const navigate = useNavigate();

  const handleTrack = () => {
    const trimmedId = trackingId.trim();

    if (!trimmedId) {
      alert("Please enter tracking number");
      return;
    }

    navigate(`/track/${trimmedId}`);
  };

  return (
    <div className="shipment-home">

      {/* HERO SECTION */}
      <section className="shipment-hero">
        <div className="shipment-hero-left">
          <h1>Track your shipment</h1>

          <div className="shipment-track-box">
            <input
              type="text"
              placeholder="Enter tracking number"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTrack();
              }}
            />
            <button onClick={handleTrack}>Track</button>
          </div>
        </div>

        {/* IMAGE */}
        <div className="shipment-hero-right">
          <img src={heroImage} alt="Delivery" />
        </div>
      </section>

      {/* CARDS SECTION */}
      <section className="shipment-cards">

        <div className="shipment-card">
          <div className="shipment-icon">📟</div>
          <h3>Rate Calculator</h3>
          <p>Get instant shipping rates</p>
        </div>

        <Link to="/servicesDelibery" className="shipment-card shipment-highlight">
          <div className="shipment-icon">🚚</div>
          <h3>Send Shipment</h3>
          <p>Start shipping with ease. No registrations required!</p>
        </Link>

        <div className="shipment-card">
          <div className="shipment-icon">💼</div>
          <h3>Business</h3>
          <p>Connect with our team to discuss your needs</p>
        </div>

        <div className="shipment-card">
          <div className="shipment-icon">🎧</div>
          <h3>Help & Support</h3>
          <p>Let’s get you the right help</p>
        </div>

      </section>

    </div>
  );
};

export default Home;