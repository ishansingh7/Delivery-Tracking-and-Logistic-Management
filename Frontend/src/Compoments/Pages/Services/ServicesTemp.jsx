import React from "react";
import "./ServicesCss/CTA.css";

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2>Ready to get started?</h2>
        <p>
          Contact us today to learn more about our services and how we can help
          your business grow.
        </p>
        <button className="cta-btn">GET STARTED</button>
      </div>
    </section>
  );
};

export default CTA;