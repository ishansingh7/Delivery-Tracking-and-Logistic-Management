import React from "react";
import "./Home.css";
import heroImage from "./photo/DeliveryBoy.png";

const Home = () => {
  return (
    <div className="shipment-home">

      {/* HERO SECTION */}
      <section className="shipment-hero">
        <div className="shipment-hero-left">
          <h1>Track your shipment</h1>

          <div className="shipment-track-box">
            <input
              type="text"
              placeholder="Type your tracking number here"
            />
            <button>Track</button>
          </div>

          <p className="shipment-info-text">
            Enter multiple tracking numbers with a space or comma.
          </p>
          <p className="shipment-info-text">
            If your tracking number isn’t working, double-check the format.
          </p>
        </div>

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

        <div className="shipment-card shipment-highlight">
          <div className="shipment-icon">🚚</div>
          <h3>Send Shipment</h3>
          <p>Start shipping with ease. No registrations required!</p>
        </div>

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
