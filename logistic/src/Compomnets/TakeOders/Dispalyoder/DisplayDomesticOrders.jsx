import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/orderoption.css";

export default function DisplayDomesticOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [trackingStatus, setTrackingStatus] = useState({});
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
        `${API_URL}/api/delivery/available`
      );
      setOrders(response.data.data || response.data);
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
        `${API_URL}/api/delivery/accept/${orderId}`,
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

  const handleSelectOrder = (orderId) => {
    setSelectedOrderId(orderId);
    const order = orders.find(o => o._id === orderId);
    setTrackingStatus({
      orderId,
      currentStatus: order?.deliveryStatus || "Processing",
      location: order?.lastLocation || "",
      notes: order?.trackingNotes || ""
    });
  };

  const updateTrackingStatus = async (orderId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(
        `${API_URL}/api/admin/update/${orderId}`,
        {
          deliveryStatus: trackingStatus.currentStatus,
          lastLocation: trackingStatus.location,
          trackingNotes: trackingStatus.notes
        }
      );
      alert("Tracking updated successfully!");
      fetchApprovedOrders();
      setSelectedOrderId(null);
    } catch (error) {
      console.error("Error updating tracking:", error);
      alert("Failed to update tracking");
    }
  };

  if (loading) {
    return <div className="loading">Loading approved orders...</div>;
  }

  return (
    <div className="orders-container">
      <h2>📦 Available Domestic Orders</h2>
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