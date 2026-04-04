import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/OrderHistory.css";

export default function OrderHistory() {
  const [historyOrders, setHistoryOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    failed: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const statusClass = (value) => {
    const status = (value || "").toLowerCase();
    if (status === "delivered") return "delivered";
    if (status === "failed") return "failed";
    if (status === "rejected") return "rejected";
    return "processing";
  };

  const statusLabel = (value) => {
    const status = (value || "").toLowerCase();
    if (status === "out for delivery") return "Out for Delivery";
    if (status === "in transit") return "In Transit";
    if (status === "failed") return "Failed";
    if (status === "rejected") return "Rejected";
    if (status === "delivered") return "Delivered";
    return value || "Completed";
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      const userId = parsedUser._id || parsedUser.id;
      if (!userId) {
        navigate("/");
        return;
      }
      fetchHistory(userId);

      // Set up real-time polling - refresh every 3 seconds
      const pollInterval = setInterval(() => {
        fetchHistory(userId);
      }, 3000);

      return () => clearInterval(pollInterval);
    } catch (error) {
      console.error("Error reading user data:", error);
      navigate("/");
    }
  }, [navigate]);

  const fetchHistory = async (userId) => {
    try {
      const [domesticRes, internationalRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/delivery/myorders/${userId}`),
        axios.get(`http://localhost:5000/api/international/myorders/${userId}`),
      ]);

      const domesticOrders = domesticRes.data.data || domesticRes.data || [];
      const internationalOrders = internationalRes.data.data || internationalRes.data || [];

      const completedOrders = [
        ...domesticOrders
          .map((order) => ({ ...order, type: "Domestic" }))
          .filter((order) => ["delivered", "completed", "failed", "rejected"].includes((order.deliveryStatus || "").toLowerCase())),
        ...internationalOrders
          .map((order) => ({ ...order, type: "International" }))
          .filter((order) => ["delivered", "completed", "failed", "rejected"].includes((order.deliveryStatus || "").toLowerCase())),
      ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      const deliveredCount = completedOrders.filter((order) => (order.deliveryStatus || "").toLowerCase() === "delivered").length;
      const failedCount = completedOrders.filter((order) => (order.deliveryStatus || "").toLowerCase() === "failed").length;
      const rejectedCount = completedOrders.filter((order) => (order.deliveryStatus || "").toLowerCase() === "rejected").length;

      setHistoryOrders(completedOrders);
      setStats({
        total: completedOrders.length,
        delivered: deliveredCount,
        failed: failedCount,
        rejected: rejectedCount,
      });
    } catch (error) {
      console.error("Error fetching order history:", error);
      setHistoryOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-page">
      <div className="history-hero">
        <div>
          <p className="eyebrow">Delivery History</p>
          <h1>Completed orders, failed deliveries, and rejected shipments</h1>
          <p className="hero-copy">
            Track every final order outcome in one place: delivered parcels, failed attempts, and rejected assignments.
          </p>
        </div>
        <div className="history-totals">
          <div className="history-card accent">
            <p>Total History</p>
            <h2>{loading ? "..." : stats.total}</h2>
          </div>
          <div className="history-card">
            <p>Delivered</p>
            <h2>{loading ? "..." : stats.delivered}</h2>
          </div>
          <div className="history-card failed">
            <p>Failed</p>
            <h2>{loading ? "..." : stats.failed}</h2>
          </div>
          <div className="history-card rejected">
            <p>Rejected</p>
            <h2>{loading ? "..." : stats.rejected}</h2>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="history-empty">Loading completed shipments...</div>
      ) : historyOrders.length === 0 ? (
        <div className="history-empty">
          <h2>No delivered orders yet</h2>
          <p>The order history will populate once you complete your first delivery.</p>
        </div>
      ) : (
        <div className="history-grid">
          {historyOrders.map((order) => (
            <article className="history-card-large" key={order._id}>
              <div className="history-card-header">
                <div>
                  <p className="history-type">{order.type} Delivery</p>
                  <h3>{order.trackingId || order._id}</h3>
                </div>
                <span className={`status-pill ${statusClass(order.deliveryStatus)}`}>
                  {statusLabel(order.deliveryStatus)}
                </span>
              </div>

              {/* Route & Timeline */}
              <div className="history-section">
                <h4 className="section-title">🚩 Route & Delivery</h4>
                <div className="section-grid">
                  <div className="section-item">
                    <p className="item-label">From</p>
                    <p className="item-value">{order.originCity}</p>
                  </div>
                  <div className="section-item">
                    <p className="item-label">To</p>
                    <p className="item-value">{order.destinationCity}</p>
                  </div>
                  <div className="section-item">
                    <p className="item-label">Completed On</p>
                    <p className="item-value">{order.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Sender Information */}
              <div className="history-section">
                <h4 className="section-title">📍 Sender Details</h4>
                <div className="section-grid">
                  <div className="section-item">
                    <p className="item-label">Name</p>
                    <p className="item-value">{order.senderName || "N/A"}</p>
                  </div>
                  <div className="section-item">
                    <p className="item-label">Phone</p>
                    <p className="item-value">{order.senderPhone || "N/A"}</p>
                  </div>
                  <div className="section-item full-width">
                    <p className="item-label">Address</p>
                    <p className="item-value">{order.senderAddress || "N/A"}</p>
                  </div>
                  {order.senderCountry && (
                    <div className="section-item">
                      <p className="item-label">Country</p>
                      <p className="item-value">{order.senderCountry}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Receiver Information */}
              <div className="history-section">
                <h4 className="section-title">🎯 Receiver Details</h4>
                <div className="section-grid">
                  <div className="section-item">
                    <p className="item-label">Name</p>
                    <p className="item-value">{order.receiverName || "N/A"}</p>
                  </div>
                  <div className="section-item">
                    <p className="item-label">Phone</p>
                    <p className="item-value">{order.receiverPhone || "N/A"}</p>
                  </div>
                  <div className="section-item full-width">
                    <p className="item-label">Address</p>
                    <p className="item-value">{order.receiverAddress || "N/A"}</p>
                  </div>
                  {order.receiverCountry && (
                    <div className="section-item">
                      <p className="item-label">Country</p>
                      <p className="item-value">{order.receiverCountry}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Package Information */}
              <div className="history-section">
                <h4 className="section-title">📦 Package Details</h4>
                <div className="section-grid">
                  <div className="section-item">
                    <p className="item-label">Type</p>
                    <p className="item-value">{order.packageType || "Standard"}</p>
                  </div>
                  <div className="section-item">
                    <p className="item-label">Weight</p>
                    <p className="item-value">{order.weight || "-"} kg</p>
                  </div>
                  {order.itemDescription && (
                    <div className="section-item full-width">
                      <p className="item-label">Description</p>
                      <p className="item-value">{order.itemDescription}</p>
                    </div>
                  )}
                  {order.itemValue && (
                    <div className="section-item">
                      <p className="item-label">Value</p>
                      <p className="item-value">${order.itemValue}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Last Location & Notes */}
              {order.lastLocation && (
                <div className="history-section">
                  <h4 className="section-title">📌 Last Location</h4>
                  <p className="item-value">{order.lastLocation}</p>
                </div>
              )}

              {order.trackingNotes && (
                <div className="history-section">
                  <h4 className="section-title">📝 Delivery Notes</h4>
                  <p className="item-value notes-text">{order.trackingNotes}</p>
                </div>
              )}

              {/* Approval Status */}
              <div className="history-footer">
                <div className="footer-item">
                  <p className="item-label">Approval Status</p>
                  <p className="item-value">{order.approvalStatus || "Pending"}</p>
                </div>
                <div className="footer-item">
                  <p className="item-label">Payment Method</p>
                  <p className="item-value">{order.paymentMethod || "N/A"}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
