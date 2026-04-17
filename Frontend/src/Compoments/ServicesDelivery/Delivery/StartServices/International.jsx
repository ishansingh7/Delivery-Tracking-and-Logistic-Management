import React, { useState } from "react";
import "./Css/International.css";

const InternationalDelivery = () => {

  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    senderEmail: "",
    senderAddress: "",
    senderCountry: "",

    receiverName: "",
    receiverPhone: "",
    receiverEmail: "",
    receiverAddress: "",
    receiverCountry: "",

    originCity: "",
    destinationCity: "",

    packageType: "",
    weight: "",
    length: "",
    width: "",
    height: "",

    itemDescription: "",
    itemValue: "",

    deliveryType: "",
    paymentMethod: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${API_URL}/api/international/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error("Shipment failed");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "international-shipment-receipt.pdf";

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

      alert("International shipment created successfully!");

      setFormData({
        senderName: "",
        senderPhone: "",
        senderEmail: "",
        senderAddress: "",
        senderCountry: "",

        receiverName: "",
        receiverPhone: "",
        receiverEmail: "",
        receiverAddress: "",
        receiverCountry: "",

        originCity: "",
        destinationCity: "",

        packageType: "",
        weight: "",
        length: "",
        width: "",
        height: "",

        itemDescription: "",
        itemValue: "",

        deliveryType: "",
        paymentMethod: ""
      });

    } catch (error) {

      console.error(error);
      alert("Error submitting shipment");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="delivery-container">

      <h1>International Delivery</h1>

      <form className="delivery-form" onSubmit={handleSubmit}>

        {/* Sender */}

        <h3>Sender Information</h3>

        <div className="form-row">

          <input
            type="text"
            name="senderName"
            placeholder="Sender Name"
            value={formData.senderName}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="senderPhone"
            placeholder="Phone Number"
            value={formData.senderPhone}
            onChange={handleChange}
            required
          />

        </div>

        <div className="form-row">

          <input
            type="email"
            name="senderEmail"
            placeholder="Email Address"
            value={formData.senderEmail}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="senderCountry"
            placeholder="Sender Country"
            value={formData.senderCountry}
            onChange={handleChange}
            required
          />

        </div>

        <textarea
          name="senderAddress"
          placeholder="Pickup Address"
          value={formData.senderAddress}
          onChange={handleChange}
          required
        />

        {/* Receiver */}

        <h3>Receiver Information</h3>

        <div className="form-row">

          <input
            type="text"
            name="receiverName"
            placeholder="Receiver Name"
            value={formData.receiverName}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="receiverPhone"
            placeholder="Phone Number"
            value={formData.receiverPhone}
            onChange={handleChange}
            required
          />

        </div>

        <div className="form-row">

          <input
            type="email"
            name="receiverEmail"
            placeholder="Email Address"
            value={formData.receiverEmail}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="receiverCountry"
            placeholder="Destination Country"
            value={formData.receiverCountry}
            onChange={handleChange}
            required
          />

        </div>

        <textarea
          name="receiverAddress"
          placeholder="Delivery Address"
          value={formData.receiverAddress}
          onChange={handleChange}
          required
        />

        {/* Location */}

        <h3>Shipping Location</h3>

        <div className="form-row">

          <input
            type="text"
            name="originCity"
            placeholder="Origin City"
            value={formData.originCity}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="destinationCity"
            placeholder="Destination City"
            value={formData.destinationCity}
            onChange={handleChange}
            required
          />

        </div>

        {/* Package */}

        <h3>Package Details</h3>

        <div className="form-row">

          <select
            name="packageType"
            value={formData.packageType}
            onChange={handleChange}
            required
          >
            <option value="">Package Type</option>
            <option value="Documents">Documents</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food Items</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={formData.weight}
            onChange={handleChange}
            required
          />

        </div>

        <div className="form-row">

          <input
            type="number"
            name="length"
            placeholder="Length (cm)"
            value={formData.length}
            onChange={handleChange}
          />

          <input
            type="number"
            name="width"
            placeholder="Width (cm)"
            value={formData.width}
            onChange={handleChange}
          />

          <input
            type="number"
            name="height"
            placeholder="Height (cm)"
            value={formData.height}
            onChange={handleChange}
          />

        </div>

        {/* Customs */}

        <h3>Customs Information</h3>

        <textarea
          name="itemDescription"
          placeholder="Item Description"
          value={formData.itemDescription}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="itemValue"
          placeholder="Declared Item Value (USD)"
          value={formData.itemValue}
          onChange={handleChange}
          required
        />

        {/* Delivery */}

        <h3>Delivery Service</h3>

        <select
          name="deliveryType"
          value={formData.deliveryType}
          onChange={handleChange}
          required
        >
          <option value="">Select Service</option>
          <option value="Standard">Standard</option>
          <option value="Express">Express</option>
          <option value="Priority">Priority</option>
        </select>

        {/* Payment */}

        <h3>Payment Method</h3>

        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="">Select Payment</option>
          <option value="OnlinePayment">Online Payment</option>
          <option value="BankTransfer">Bank Transfer</option>
          <option value="CashOnDelivery">Cash on Delivery</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Send International Shipment"}
        </button>

      </form>

    </div>

  );

};

export default InternationalDelivery;