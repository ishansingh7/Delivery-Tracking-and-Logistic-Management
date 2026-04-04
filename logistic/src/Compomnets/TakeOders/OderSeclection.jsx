// src/pages/DeliveryType.jsx
import React, { useState } from "react";
import "./css/orderoption.css";

export default function DeliveryType() {
  const [selectedType, setSelectedType] = useState("");

  return (
    <div className="dx-container">
      <div className="dx-inner">
        <h1 className="dx-heading">Select Delivery Mode</h1>
        <p className="dx-subtext">Choose how you want to ship</p>

        <div className="dx-options">
          {/* Domestic */}
          <div
            className={`dx-box ${
              selectedType === "domestic" ? "dx-active" : ""
            }`}
            onClick={() => setSelectedType("domestic")}
          >
            <div className="dx-emoji">🚛</div>
            <h2>Domestic</h2>
            <p>Within your country</p>
          </div>

          {/* International */}
          <div
            className={`dx-box ${
              selectedType === "international" ? "dx-active" : ""
            }`}
            onClick={() => setSelectedType("international")}
          >
            <div className="dx-emoji">🌍</div>
            <h2>International</h2>
            <p>Across borders</p>
          </div>
        </div>

        <button className="dx-btn">Continue</button>
      </div>
    </div>
  );
}