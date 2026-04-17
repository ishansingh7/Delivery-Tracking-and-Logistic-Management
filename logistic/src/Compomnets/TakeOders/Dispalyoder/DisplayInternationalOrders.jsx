import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/orderoption.css";

export default function DisplayInternationalOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchApprovedOrders();

        const pollInterval = setInterval(() => {
          fetchApprovedOrders();
        }, 3000);

        return () => clearInterval(pollInterval);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const fetchApprovedOrders = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(
        `${API_URL}/api/international/available`
      );
      const result = response.data?.data ?? response.data;
      setOrders(Array.isArray(result) ? result : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching approved orders:", error);
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    if (!user) {
      alert("User information not found");
      return;
    }

    setSelectedOrderId(orderId);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(
        `${API_URL}/api/international/accept/${orderId}`,
        {
          deliveryPersonId: user._id,
          deliveryPersonName: user.name,
          deliveryPersonPhone: user.phone,
          deliveryPersonLicense: user.licenseNumber,
          deliveryPersonPhoto: user.photo
        }
      );

      alert("Order accepted successfully!");
      await fetchApprovedOrders();
      setSelectedOrderId(null);
    } catch (error) {
      console.error("Error accepting order:", error);
      alert("Failed to accept order");
      setSelectedOrderId(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading approved orders...</div>;
  }

  return (
    <div className="orders-container">
      <h2>🌍 Available International Orders</h2>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Select an order to accept and start delivery
      </p>

      {orders.length === 0 ? (
        <p className="no-orders">No available orders at the moment</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <p>
                    <strong>Tracking ID:</strong> {order.trackingId}
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
                    <strong>Email:</strong> {order.senderEmail}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.senderAddress}, {order.senderCountry}
                  </p>
                </div>

                <div className="detail-section">
                  <h4>🎯 Receiver Details</h4>
                  <p>
                    <strong>Name:</strong> {order.receiverName}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.receiverEmail}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.receiverAddress}, {order.receiverCountry}
                  </p>
                </div>

                <div className="detail-section">
                  <h4>📦 Package Details</h4>
                  <p>
                    <strong>Description:</strong> {order.itemDescription}
                  </p>
                  <p>
                    <strong>Weight:</strong> {order.weight} kg ({order.length}x{order.width}x{order.height})
                  </p>
                  <p>
                    <strong>Value:</strong> ${order.itemValue}
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
                onClick={() => handleAcceptOrder(order._id)}
                disabled={selectedOrderId === order._id}
              >
                {selectedOrderId === order._id ? "Accepting..." : "✓ Accept Order"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}