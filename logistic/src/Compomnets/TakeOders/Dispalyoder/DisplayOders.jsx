import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/orderoption.css";

export default function DisplayOrders() {
  const [domesticOrders, setDomesticOrders] = useState([]);
  const [internationalOrders, setInternationalOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [trackingStatus, setTrackingStatus] = useState({});
  const [user, setUser] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  const statusLabel = (value) => {
    const status = (value || "Processing").toLowerCase();
    if (status === "out for delivery") return "Out for Delivery";
    if (status === "in transit") return "In Transit";
    if (status === "failed") return "Failed";
    if (status === "rejected") return "Rejected";
    if (status === "delivered") return "Delivered";
    if (status === "available") return "Available";
    return value || "Processing";
  };

  const statusClass = (value) => {
    const status = (value || "processing").toLowerCase();
    if (status === "delivered") return "delivered";
    if (status === "failed") return "failed";
    if (status === "rejected") return "rejected";
    if (status === "available") return "available";
    if (status === "in transit") return "in-transit";
    if (status === "out for delivery") return "in-transit";
    return "processing";
  };

  const assignmentLabel = (order) => {
    const status = (order.deliveryStatus || "").toLowerCase();
    if (status === "in transit" || status === "out for delivery") {
      return "In Transit";
    }
    if (order.deliveryPersonName || order.assignedTo) {
      return "Assigned";
    }
    return null;
  };

  useEffect(() => {
    let filtered = allOrders;

    if (filterType !== "all") {
      filtered = filtered.filter((order) => {
        const isIntl = !!order.senderCountry;
        return filterType === "international" ? isIntl : !isIntl;
      });
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => statusClass(order.deliveryStatus) === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.receiverName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [allOrders, filterType, filterStatus, searchTerm]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchMyOrders(parsedUser._id);

        // Set up real-time polling - refresh every 3 seconds
        const pollInterval = setInterval(() => {
          fetchMyOrders(parsedUser._id);
        }, 3000);

        return () => clearInterval(pollInterval);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const fetchMyOrders = async (userId) => {
    try {
      const [domesticRes, internationalRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/delivery/myorders/${userId}`),
        axios.get(`http://localhost:5000/api/international/myorders/${userId}`)
      ]);

      const domestic = (domesticRes.data.data || domesticRes.data || []).map((order) => ({
        ...order,
        type: "Domestic"
      }));
      const international = (internationalRes.data.data || internationalRes.data || []).map((order) => ({
        ...order,
        type: "International"
      }));

      const activeOrders = [...domestic, ...international].filter((order) => {
        const status = (order.deliveryStatus || "").toLowerCase();
        return !["delivered", "completed", "failed", "rejected"].includes(status);
      });

      setDomesticOrders(domestic);
      setInternationalOrders(international);
      setAllOrders(activeOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrderId(orderId);
    const order = allOrders.find(o => o._id === orderId);
    
    if (order) {
      const initialStatus = {
        orderId: order._id,
        currentStatus: order?.deliveryStatus || "Processing",
        location: order?.lastLocation || "",
        notes: order?.trackingNotes || ""
      };
      console.log("📋 Order selected. Initial status:", initialStatus);
      setTrackingStatus(initialStatus);
    } else {
      console.warn("⚠️ Order not found:", orderId);
    }
  };

  const updateTrackingStatus = async (orderId) => {
    try {
      const payload = {
        deliveryStatus: trackingStatus.currentStatus,
        lastLocation: trackingStatus.location,
        trackingNotes: trackingStatus.notes
      };

      console.log("🔄 Updating order:", orderId, "Payload:", payload);

      const order = allOrders.find((o) => o._id === orderId);
      const isInternational = order?.type === "International" || !!order?.senderCountry;
      const endpoint = isInternational
        ? `http://localhost:5000/api/admin/international/update/${orderId}`
        : `http://localhost:5000/api/admin/update/${orderId}`;

      const response = await axios.put(
        endpoint,
        payload,
        { timeout: 10000 }
      );

      console.log("✅ Update endpoint:", endpoint);
      console.log("✅ Response Status:", response.status);
      console.log("✅ Response Data:", response.data);

      // Any 2xx status code and valid data = success
      if (response && response.status >= 200 && response.status < 300) {
        console.log("✅ Update successful - Status code:", response.status);

        const normalizedStatus = (trackingStatus.currentStatus || "").toLowerCase();
        const completedStatus = ["delivered", "completed", "failed", "rejected"];

        if (completedStatus.includes(normalizedStatus)) {
          setAllOrders((prev) => prev.filter((o) => o._id !== orderId));
          console.log("📦 Order moved to history");
          alert(`✅ Order status updated to ${statusLabel(trackingStatus.currentStatus)} and moved to history.`);
        } else {
          console.log("🔄 Refreshing orders list...");
          if (user) {
            await fetchMyOrders(user._id);
          }
          alert("✅ Tracking updated successfully!");
        }

        setSelectedOrderId(null);
        setTrackingStatus({ orderId: null, currentStatus: "", location: "", notes: "" });
        console.log("🎉 Update process completed");
      } else {
        console.error("❌ Unexpected response status:", response.status);
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Full error object:", error);
      console.error("❌ Error response:", error.response);
      
      let errorMessage = "Failed to update tracking";

      // Network/timeout errors
      if (error.code === "ECONNABORTED" || error.message === "timeout of 10000ms exceeded") {
        errorMessage = "⏱️ Request timeout - server not responding. Check if backend is running on port 5000.";
      }
      // Server errors
      else if (error.response?.status === 404) {
        errorMessage = "❌ Order not found on server";
      } else if (error.response?.status === 400) {
        errorMessage = "❌ Invalid order data: " + (error.response?.data?.message || "Bad request");
      } else if (error.response?.status === 500) {
        errorMessage = "❌ Server error: " + (error.response?.data?.message || "Internal server error");
      }
      // API errors
      else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      // Network errors
      else if (error.message.includes("Network")) {
        errorMessage = "❌ Network error - cannot reach the server";
      }
      // Generic error
      else if (error.message) {
        errorMessage = error.message;
      }

      console.error("Final error message:", errorMessage);
      alert(`⚠️ ${errorMessage}`);
    }
  };

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  const processingCount = allOrders.filter((o) => statusClass(o.deliveryStatus) === "processing").length;
  const inTransitCount = allOrders.filter((o) => statusClass(o.deliveryStatus) === "in-transit").length;
  const domesticCount = allOrders.filter((o) => !o.senderCountry).length;
  const internationalCount = allOrders.filter((o) => o.senderCountry).length;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div>
          <h2>My Active Orders</h2>
          <p>Manage and track your assigned deliveries</p>
        </div>
      </div>

      {allOrders.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📦</p>
          <h3>No Active Orders</h3>
          <p>You haven't accepted any orders yet. Go to "Accept Orders" to start taking deliveries.</p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="orders-summary">
            <div className="summary-card">
              <p className="summary-label">Total Orders</p>
              <h3>{allOrders.length}</h3>
            </div>
            <div className="summary-card accent">
              <p className="summary-label">Processing</p>
              <h3>{processingCount}</h3>
            </div>
            <div className="summary-card accent-secondary">
              <p className="summary-label">In Transit</p>
              <h3>{inTransitCount}</h3>
            </div>
            <div className="summary-card">
              <p className="summary-label">Domestic</p>
              <h3>{domesticCount}</h3>
            </div>
            <div className="summary-card">
              <p className="summary-label">International</p>
              <h3>{internationalCount}</h3>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="filters-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Tracking ID, sender, or receiver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="filter-controls">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="domestic">Domestic</option>
                <option value="international">International</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="processing">Processing</option>
                <option value="in-transit">In Transit</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="orders-table-wrapper">
            <div className="orders-table-header">
              <div className="col-tracking">Tracking ID</div>
              <div className="col-type">Type</div>
              <div className="col-route">Route</div>
              <div className="col-status">Status</div>
              <div className="col-action">Action</div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="empty-filter">
                <p>No orders match your filters. Try adjusting your search.</p>
              </div>
            ) : (
              <div className="orders-table-body">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="order-row">
                    <div className="col-tracking">
                      <span className="tracking-id">{order.trackingId}</span>
                    </div>
                    <div className="col-type">
                      <span className={`type-badge ${order.senderCountry ? "intl" : "domestic"}`}>
                        {order.senderCountry ? "🌍 Intl" : "🏠 Dom"}
                      </span>
                    </div>
                    <div className="col-route">
                      <span className="route-text">{order.originCity} → {order.destinationCity}</span>
                    </div>
                    <div className="col-status">
                      <span className={`status-badge ${statusClass(order.deliveryStatus)}`}>
                        {statusLabel(order.deliveryStatus)}
                      </span>
                      {assignmentLabel(order) && (
                        <span className="assignment-badge">
                          {assignmentLabel(order)}
                        </span>
                      )}
                    </div>
                    <div className="col-action">
                      <button
                        className="action-btn expand-btn"
                        onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                      >
                        {expandedOrderId === order._id ? "▼" : "▶"} Details
                      </button>
                    </div>

                    {/* Expandable Details */}
                    {expandedOrderId === order._id && (
                      <div className="order-details-expanded">
                        <div className="details-grid">
                          {/* Sender */}
                          <div className="detail-block">
                            <h5>From (Sender)</h5>
                            <p className="detail-name">{order.senderName}</p>
                            <p className="detail-text">{order.senderPhone}</p>
                            <p className="detail-text">{order.senderAddress}</p>
                            {order.senderCountry && <p className="detail-text">📍 {order.senderCountry}</p>}
                          </div>

                          {/* Receiver */}
                          <div className="detail-block">
                            <h5>To (Receiver)</h5>
                            <p className="detail-name">{order.receiverName}</p>
                            <p className="detail-text">{order.receiverPhone}</p>
                            <p className="detail-text">{order.receiverAddress}</p>
                            {order.receiverCountry && <p className="detail-text">📍 {order.receiverCountry}</p>}
                          </div>

                          {/* Package */}
                          <div className="detail-block">
                            <h5>Package</h5>
                            <p className="detail-text"><strong>Type:</strong> {order.packageType}</p>
                            <p className="detail-text"><strong>Weight:</strong> {order.weight} kg</p>
                            {order.itemDescription && (
                              <p className="detail-text"><strong>Desc:</strong> {order.itemDescription}</p>
                            )}
                          </div>

                          {/* Tracking Update */}
                          <div className="detail-block full-width">
                            <h5>Update Tracking</h5>
                            {selectedOrderId === order._id ? (
                              <div className="quick-update-form">
                                <div className="form-row">
                                  <div className="form-col">
                                    <label>Status:</label>
                                    <select
                                      value={trackingStatus.currentStatus || order.deliveryStatus}
                                      onChange={(e) =>
                                        setTrackingStatus({
                                          ...trackingStatus,
                                          currentStatus: e.target.value
                                        })
                                      }
                                      className="form-input"
                                    >
                                      <option>Processing</option>
                                      <option>In Transit</option>
                                      <option>Out for Delivery</option>
                                      <option>Delivered</option>
                                      <option>Failed</option>
                                    </select>
                                  </div>
                                  <div className="form-col">
                                    <label>Location:</label>
                                    <input
                                      type="text"
                                      placeholder="Current location"
                                      value={trackingStatus.location || ""}
                                      onChange={(e) =>
                                        setTrackingStatus({
                                          ...trackingStatus,
                                          location: e.target.value
                                        })
                                      }
                                      className="form-input"
                                    />
                                  </div>
                                </div>
                                <div className="form-row">
                                  <div className="form-col full">
                                    <label>Notes:</label>
                                    <textarea
                                      placeholder="Add any tracking notes..."
                                      value={trackingStatus.notes || ""}
                                      onChange={(e) =>
                                        setTrackingStatus({
                                          ...trackingStatus,
                                          notes: e.target.value
                                        })
                                      }
                                      className="form-input"
                                      rows="3"
                                    />
                                  </div>
                                </div>
                                <div className="form-actions">
                                  <button
                                    className="btn-primary"
                                    onClick={() => updateTrackingStatus(order._id)}
                                  >
                                    Save Update
                                  </button>
                                  <button
                                    className="btn-secondary"
                                    onClick={() => setSelectedOrderId(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                className="update-btn"
                                onClick={() => handleSelectOrder(order._id)}
                              >
                                📝 Update Tracking
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}