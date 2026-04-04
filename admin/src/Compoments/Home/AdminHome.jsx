import { useState, useEffect } from "react";
import "./Home.css";

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    approved: 0,
    inTransit: 0,
    delivered: 0,
    assigned: 0,
    activeDrivers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();

    const pollInterval = setInterval(() => {
      fetchStats();
    }, 3000);

    return () => clearInterval(pollInterval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const domesticRes = await fetch("http://localhost:5000/api/admin/deliveries");
      const internationalRes = await fetch("http://localhost:5000/api/admin/international/deliveries");
      const driversRes = await fetch("http://localhost:5000/api/delivery/auth/all-agents");

      const domesticData = domesticRes.ok ? await domesticRes.json() : [];
      const internationalData = internationalRes.ok ? await internationalRes.json() : [];
      const driversData = driversRes.ok ? await driversRes.json() : [];

      const domesticDeliveries = Array.isArray(domesticData) ? domesticData : domesticData.deliveries || [];
      const internationalDeliveries = Array.isArray(internationalData) ? internationalData : internationalData.deliveries || [];
      const allDeliveries = [...domesticDeliveries, ...internationalDeliveries];

      const lowerStatus = (value) => (value || "").toLowerCase();
      const approvedCount = allDeliveries.filter(
        (d) => lowerStatus(d.approvalStatus) === "approved"
      ).length;
      const inTransitCount = allDeliveries.filter(
        (d) => ["in transit", "out for delivery"].includes(lowerStatus(d.deliveryStatus))
      ).length;
      const deliveredCount = allDeliveries.filter(
        (d) => lowerStatus(d.deliveryStatus) === "delivered"
      ).length;
      const assignedCount = allDeliveries.filter(
        (d) => d.deliveryPersonName || d.assignedTo
      ).length;
      const activeDrivers = Array.isArray(driversData) ? driversData.length : driversData.agents?.length || 0;

      setStats({
        totalDeliveries: allDeliveries.length,
        approved: approvedCount,
        inTransit: inTransitCount,
        delivered: deliveredCount,
        assigned: assignedCount,
        activeDrivers,
      });

      setRecentOrders(
        allDeliveries
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5)
      );
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-home">
      <div className="welcome-section">
        <h1>Welcome to Admin Dashboard 👋</h1>
        <p>Track the real delivery status for domestic and international orders.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">📦</div>
          <h3>{loading ? "..." : stats.totalDeliveries}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">✅</div>
          <h3>{loading ? "..." : stats.approved}</h3>
          <p>Approved Orders</p>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">🚚</div>
          <h3>{loading ? "..." : stats.inTransit}</h3>
          <p>In Transit</p>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🎯</div>
          <h3>{loading ? "..." : stats.delivered}</h3>
          <p>Delivered</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginTop: "20px" }}>
        <div className="stat-card secondary">
          <div className="stat-icon">👥</div>
          <h3>{loading ? "..." : stats.assigned}</h3>
          <p>Assigned Orders</p>
        </div>
        <div className="stat-card secondary">
          <div className="stat-icon">🚀</div>
          <h3>{loading ? "..." : stats.activeDrivers}</h3>
          <p>Active Drivers</p>
        </div>
      </div>

      <div className="activity-section">
        <h2>📋 Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p>No recent orders to show right now.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tracking</th>
                <th>Type</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Agent</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.trackingId}</td>
                  <td>{order.type || (order.senderCountry ? "International" : "Domestic")}</td>
                  <td>{order.deliveryStatus || "Processing"}</td>
                  <td>{order.approvalStatus || "Pending"}</td>
                  <td>{order.deliveryPersonName || "Unassigned"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}