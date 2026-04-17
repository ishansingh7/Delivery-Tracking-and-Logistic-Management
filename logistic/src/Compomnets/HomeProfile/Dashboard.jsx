import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Home.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    delivered: 0,
    processing: 0,
    inTransit: 0,
    approved: 0,
    assigned: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        const userId = parsedUser._id || parsedUser.id;
        if (userId) {
          fetchOrders(userId);

          // Set up real-time polling - refresh every 3 seconds
          const pollInterval = setInterval(() => {
            fetchOrders(userId);
          }, 3000);

          return () => clearInterval(pollInterval);
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchOrders = async (userId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const [domesticRes, internationalRes] = await Promise.all([
        axios.get(`${API_URL}/api/delivery/myorders/${userId}`),
        axios.get(`${API_URL}/api/international/myorders/${userId}`),
      ]);

      const domesticOrders = domesticRes.data.data || domesticRes.data || [];
      const internationalOrders = internationalRes.data.data || internationalRes.data || [];

      const allOrders = [
        ...domesticOrders.map((order) => ({ ...order, type: "Domestic" })),
        ...internationalOrders.map((order) => ({ ...order, type: "International" })),
      ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      const delivered = allOrders.filter(
        (o) => o.deliveryStatus?.toLowerCase() === "delivered"
      ).length;
      const processing = allOrders.filter(
        (o) => ["processing", "pending"].includes(o.deliveryStatus?.toLowerCase())
      ).length;
      const inTransit = allOrders.filter(
        (o) => ["in transit", "out for delivery"].includes(o.deliveryStatus?.toLowerCase())
      ).length;
      const approved = allOrders.filter(
        (o) => o.approvalStatus?.toLowerCase() === "approved"
      ).length;
      const assigned = allOrders.filter(
        (o) => o.deliveryPersonName || o.assignedTo
      ).length;

      setOrders(allOrders.slice(0, 5));
      setStats({
        totalOrders: allOrders.length,
        delivered,
        processing,
        inTransit,
        approved,
        assigned,
      });
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  if (!user) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  return (
    <div>
      <div className="header">
        <h2>Welcome, {user?.name}! 👋</h2>
        <div className="user">
          <span>{user?.name}</span>
          <img
            src={user?.photo ? (user.photo.startsWith("http") ? user.photo : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${user.photo}`) : "https://via.placeholder.com/50"}
            alt="profile"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/50";
            }}
          />
        </div>
      </div>

      <div className="stats">
        <div className="card">
          <h3>{stats.totalOrders}</h3>
          <p>My Orders</p>
        </div>
        <div className="card">
          <h3>{stats.approved}</h3>
          <p>Approved</p>
        </div>
        <div className="card">
          <h3>{stats.inTransit}</h3>
          <p>In Transit</p>
        </div>
        <div className="card">
          <h3>{stats.delivered}</h3>
          <p>Delivered</p>
        </div>
      </div>

      <div className="history-section" style={{ margin: "32px 0", padding: "24px", borderRadius: "24px", background: "linear-gradient(135deg, rgba(14,165,233,0.1), rgba(14,165,233,0.03))", border: "1px solid rgba(14,165,233,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <p style={{ textTransform: "uppercase", letterSpacing: "0.14em", color: "#0369a1", fontWeight: 700, marginBottom: "10px" }}>Completed Delivery Summary</p>
            <h3 style={{ margin: 0, fontSize: "1.8rem", color: "#0f172a" }}>Your full delivery history is ready.</h3>
            <p style={{ marginTop: "12px", color: "#475569", maxWidth: "620px" }}>
              Track all delivered shipments in one place. Order history will show completed deliveries, delivery agent details, and final route data.
            </p>
          </div>
          <button
            onClick={() => navigate("/order-history")}
            style={{
              border: "none",
              background: "#0ea5e9",
              color: "#ffffff",
              padding: "14px 24px",
              borderRadius: "999px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 18px 45px rgba(14,165,233,0.25)"
            }}
          >
            View Order History
          </button>
        </div>
      </div>

      <div className="orders">
        <h3>📦 My Active Deliveries ({orders.length})</h3>

        {orders.length === 0 ? (
          <p style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            You currently have no assigned deliveries.
          </p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order">
              <div>
                <p><strong>Tracking:</strong> {order.trackingId}</p>
                <p><strong>Type:</strong> {order.type}</p>
                <p><strong>Route:</strong> {order.originCity} → {order.destinationCity}</p>
                <p><strong>Status:</strong> <span className="status-badge">{order.deliveryStatus || "Processing"}</span></p>
                <p><strong>Approval:</strong> {order.approvalStatus || "Pending"}</p>
              </div>
              <button onClick={() => window.location.href = "/displayorders"}>View Orders</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;