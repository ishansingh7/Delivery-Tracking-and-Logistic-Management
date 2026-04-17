import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/orderoption.css";

export default function AcceptOrders() {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [acceptingOrder, setAcceptingOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchAvailableOrders();

        const pollInterval = setInterval(() => {
          fetchAvailableOrders();
        }, 3000);

        return () => clearInterval(pollInterval);
      } catch (err) {
        console.error("Error parsing user data:", err);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchAvailableOrders = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const [domesticResponse, internationalResponse] = await Promise.all([
        axios.get(`${API_URL}/api/delivery/available`),
        axios.get(`${API_URL}/api/international/available`)
      ]);

      const domesticOrders = domesticResponse.data.data || domesticResponse.data || [];
      const internationalOrders = internationalResponse.data.data || internationalResponse.data || [];

      const mergedOrders = [
        ...domesticOrders.map((order) => ({ ...order, deliveryCategory: "Domestic" })),
        ...internationalOrders.map((order) => ({ ...order, deliveryCategory: "International" }))
      ];

      setAvailableOrders(mergedOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching available orders:", error);
      setAvailableOrders([]);
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId, deliveryCategory) => {
    if (!user) {
      alert("User information not found");
      return;
    }

    setAcceptingOrder(orderId);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const endpoint =
        deliveryCategory === "International"
          ? `${API_URL}/api/international/accept/${orderId}`
          : `${API_URL}/api/delivery/accept/${orderId}`;

      await axios.post(endpoint, {
        deliveryPersonId: user._id,
        deliveryPersonName: user.name,
        deliveryPersonPhone: user.phone,
        deliveryPersonLicense: user.licenseNumber,
        deliveryPersonPhoto: user.photo
      });

      alert("Order accepted successfully!");
      setAcceptingOrder(null);
      await fetchAvailableOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
      alert("Failed to accept order");
      setAcceptingOrder(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading available orders...</div>;
  }

  return (
    <div className="orders-container">
      <h2>📦 Available Orders for Pickup</h2>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Select an order to accept and start delivery
      </p>

      {availableOrders.length === 0 ? (
        <p className="no-orders">No available orders at the moment</p>
      ) : (
        <div className="orders-list">
          {availableOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <p>
                    <strong>Tracking ID:</strong> {order.trackingId}
                  </p>
                  <p>
                    <strong>Type:</strong> {order.deliveryCategory}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="badge">Available</span>
                  </p>
                </div>
              </div>

              <div className="order-details">
                <div className="detail-section">
                  <h4>📍 Sender Details</h4>
                  <p>
                    <strong>Name:</strong> {order.senderName}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.senderPhone}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.senderAddress}
                  </p>
                </div>

                <div className="detail-section">
                  <h4>🎯 Receiver Details</h4>
                  <p>
                    <strong>Name:</strong> {order.receiverName}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.receiverPhone}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.receiverAddress}
                  </p>
                </div>

                <div className="detail-section">
                  <h4>📦 Package Details</h4>
                  <p>
                    <strong>Type:</strong> {order.packageType}
                  </p>
                  <p>
                    <strong>Weight:</strong> {order.weight} kg
                  </p>
                  <p>
                    <strong>Delivery Type:</strong> {order.deliveryType}
                  </p>
                </div>

                <div className="detail-section">
                  <h4>🚩 Route</h4>
                  <p>
                    <strong>From:</strong> {order.originCity}
                  </p>
                  <p>
                    <strong>To:</strong> {order.destinationCity}
                  </p>
                </div>
              </div>

              <button
                className="accept-btn"
                onClick={() => handleAcceptOrder(order._id, order.deliveryCategory)}
                disabled={acceptingOrder === order._id}
              >
                {acceptingOrder === order._id ? "Accepting..." : "✓ Accept Order"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}