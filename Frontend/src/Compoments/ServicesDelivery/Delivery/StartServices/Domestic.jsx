import React, { useState } from "react";
import "./Css/Domestic.css";

const DomesticDelivery = () => {

  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    originCity: "",
    destinationCity: "",
    packageType: "",
    weight: "",
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

      const response = await fetch("http://localhost:5000/api/delivery/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      // Convert response to blob
      const blob = await response.blob();

      // Get filename from backend if provided
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "delivery-receipt.pdf";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match) filename = match[1];
      }

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert("Delivery request submitted successfully! PDF downloaded.");

      // Reset form
      setFormData({
        senderName: "",
        senderPhone: "",
        senderAddress: "",
        receiverName: "",
        receiverPhone: "",
        receiverAddress: "",
        originCity: "",
        destinationCity: "",
        packageType: "",
        weight: "",
        deliveryType: "",
        paymentMethod: ""
      });

    } catch (error) {

      console.error("Submit Error:", error);
      alert("Error submitting delivery request. Check backend.");

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="delivery-container">

      <h1>Send Delivery Nationwide</h1>

      <form onSubmit={handleSubmit} className="delivery-form">

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
            placeholder="Sender Phone"
            value={formData.senderPhone}
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
            placeholder="Receiver Phone"
            value={formData.receiverPhone}
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

        <h3>Location</h3>

        <div className="form-row">
          <input
            type="text"
            name="originCity"
            placeholder="Pickup City"
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

        <h3>Package Details</h3>

        <div className="form-row">

          <select
            name="packageType"
            value={formData.packageType}
            onChange={handleChange}
            required
          >
            <option value="">Select Package Type</option>
            <option value="Documents">Documents</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothes">Clothes</option>
            <option value="Food">Food</option>
            <option value="Others">Others</option>
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

        <h3>Delivery Type</h3>

        <select
          name="deliveryType"
          value={formData.deliveryType}
          onChange={handleChange}
          required
        >
          <option value="">Select Delivery Type</option>
          <option value="Standard">Standard Delivery</option>
          <option value="Express">Express Delivery</option>
          <option value="SameDay">Same Day Delivery</option>
        </select>

        <h3>Payment Method</h3>

        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="">Select Payment Method</option>
          <option value="CashOnDelivery">Cash on Delivery</option>
          <option value="OnlinePayment">Online Payment</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Delivery"}
        </button>

      </form>

    </div>
  );
};

export default DomesticDelivery;