import React from "react";
import "./Servicesdelivery.css";
import { Link } from "react-router-dom";

import domesticImg from "../../../assets/images/HomeDelivery.png";
import internationalImg from "../../../assets/images/InternationalDelivery.png";

function ServicesDelivery() {
  return (
    <div className="services-page">

      {/* Header */}
      <div className="services-header">
        <h1>Our Logistics Services</h1>
        <p>
          Reliable and fast delivery solutions designed for businesses and
          individuals around the world.
        </p>
      </div>

      {/* Services Container */}

      <div className="services-container">

        {/* Domestic Delivery */}

        <div className="service-card">


          <img
            src={domesticImg}
            alt="Domestic Delivery"
            className="service-image"
          />


          <h2>Domestic Delivery</h2>
          <Link to="/DomesticDelivery">
            <button className="start-btn">Start Service</button>
          </Link>

          <p>
            Our domestic delivery network ensures fast and secure shipping
            across cities and states with real-time tracking.
          </p>

          <ul>
            <li>✔ Same-day delivery in major cities</li>
            <li>✔ Real-time parcel tracking</li>
            <li>✔ Affordable shipping prices</li>
            <li>✔ Door-to-door delivery</li>
            <li>✔ Safe package handling</li>
          </ul>


        </div>

        {/* International Delivery */}

        <div className="service-card">

          <img
            src={internationalImg}
            alt="International Delivery"
            className="service-image"
          />

          <h2>International Delivery</h2>
         <Link to="/InternationalDelivery">
            <button className="start-btn">Start Service</button>
          </Link>

          <p>
            Ship packages globally with our trusted international logistics
            network covering more than 200 countries worldwide.
          </p>

          <ul>
            <li>✔ Delivery to 200+ countries</li>
            <li>✔ Customs clearance support</li>
            <li>✔ Global real-time tracking</li>
            <li>✔ Express international shipping</li>
            <li>✔ Secure & insured deliveries</li>
          </ul>


        </div>

      </div>

    </div>
  );
}

export default ServicesDelivery;