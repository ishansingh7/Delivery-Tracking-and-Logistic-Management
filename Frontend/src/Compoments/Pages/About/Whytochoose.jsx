import React from "react";
import "../PagesCss/Whytochoose.css";
import { FaShippingFast, FaShieldAlt, FaClock, FaHeadset, FaGlobeAsia, FaTruck } from "react-icons/fa";

const WhyChooseUs = () => {
  return (
    <section className="why-section">

      <div className="why-header">
        <h2>Why Choose Us</h2>
        <p>
          We are committed to delivering excellence in logistics and courier services.
          Here’s why thousands trust Nepal Can Move.
        </p>
      </div>

      <div className="why-grid">

        <div className="why-card">
          <FaShippingFast className="why-icon" />
          <h3>Fast & Reliable Delivery</h3>
          <ul>
            <li>Same-day & express delivery options</li>
            <li>Real-time shipment tracking</li>
            <li>On-time guaranteed service</li>
          </ul>
        </div>

        <div className="why-card">
          <FaShieldAlt className="why-icon" />
          <h3>Safe & Secure Handling</h3>
          <ul>
            <li>Advanced package protection systems</li>
            <li>Secure warehousing facilities</li>
            <li>Fully insured shipments</li>
          </ul>
        </div>

        <div className="why-card">
          <FaClock className="why-icon" />
          <h3>24/7 Customer Support</h3>
          <ul>
            <li>Dedicated support team</li>
            <li>Quick issue resolution</li>
            <li>Multi-channel communication</li>
          </ul>
        </div>

        <div className="why-card">
          <FaTruck className="why-icon" />
          <h3>Nationwide Coverage</h3>
          <ul>
            <li>Service across Nepal</li>
            <li>Urban & remote delivery support</li>
            <li>Fleet management solutions</li>
          </ul>
        </div>

        <div className="why-card">
          <FaGlobeAsia className="why-icon" />
          <h3>Global Logistics Network</h3>
          <ul>
            <li>International shipping solutions</li>
            <li>Import & export handling</li>
            <li>Custom clearance assistance</li>
          </ul>
        </div>

        <div className="why-card">
          <FaHeadset className="why-icon" />
          <h3>Customer-Centric Approach</h3>
          <ul>
            <li>Personalized logistics solutions</li>
            <li>Transparent pricing</li>
            <li>Long-term partnership focus</li>
          </ul>
        </div>

      </div>

    </section>
  );
};

export default WhyChooseUs;