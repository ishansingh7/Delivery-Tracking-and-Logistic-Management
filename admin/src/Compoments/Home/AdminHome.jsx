import { useState, useEffect } from "react";
import "./Home.css";

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completed: 0,
    pending: 0,
    activeDrivers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all deliveries (domestic + international)
      const domesticRes = await fetch("http://localhost:5000/api/admin/deliveries");
      const internationalRes = await fetch("http://localhost:5000/api/admin/international/deliveries");
      const driversRes = await fetch("http://localhost:5000/api/delivery/auth/all-agents");

      const domesticData = domesticRes.ok ? await domesticRes.json() : { deliveries: [] };
      const internationalData = internationalRes.ok ? await internationalRes.json() : { deliveries: [] };
      const driversData = driversRes.ok ? await driversRes.json() : { agents: [] };

      const domesticDeliveries = domesticData.deliveries || [];
      const internationalDeliveries = internationalData.deliveries || [];
      const allDeliveries = [...domesticDeliveries, ...internationalDeliveries];

      const totalDeliveries = allDeliveries.length;
      const completedDeliveries = allDeliveries.filter(
        (d) => d.status === "completed" || d.status === "delivered" || d.status === "approved"
      ).length;
      const pendingDeliveries = allDeliveries.filter(
        (d) => d.status === "pending" || d.status === "in-transit" || d.status === "rejected"
      ).length;
      const activeDrivers = driversData.agents?.length || 0;

      setStats({
        totalDeliveries,
        completed: completedDeliveries,
        pending: pendingDeliveries,
        activeDrivers,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-home">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome to Admin Dashboard 👋</h1>
        <p>Here you can manage all your delivery operations and view important metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">📦</div>
          <h3>{loading ? "..." : stats.totalDeliveries}</h3>
          <p>Total Deliveries</p>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">✅</div>
          <h3>{loading ? "..." : stats.completed}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">⏳</div>
          <h3>{loading ? "..." : stats.pending}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🚚</div>
          <h3>{loading ? "..." : stats.activeDrivers}</h3>
          <p>Active Drivers</p>
        </div>
      </div>

      {/* Activity Section */}
      <div className="activity-section">
        <h2>📋 Recent Activity</h2>
        <ul className="activity-list">
          <li className="activity-item">
            <div className="activity-status success">✓</div>
            <div className="activity-text">
              <h4>Delivery Completed</h4>
              <p>Package delivered successfully</p>
            </div>
          </li>
          <li className="activity-item">
            <div className="activity-status pending">⏳</div>
            <div className="activity-text">
              <h4>New Order Created</h4>
              <p>Order awaiting assignment</p>
            </div>
          </li>
          <li className="activity-item">
            <div className="activity-status success">✓</div>
            <div className="activity-text">
              <h4>Driver Verified</h4>
              <p>New driver account verified</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="activity-section">
        <h2>⚡ Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-btn">
            ➕ New Delivery
          </button>
          <button className="action-btn">
            👥 View Drivers
          </button>
          <button className="action-btn secondary">
            📊 View Reports
          </button>
          <button className="action-btn secondary">
            ⚙️ Settings
          </button>
        </div>
      </div>
    </div>
  );
}