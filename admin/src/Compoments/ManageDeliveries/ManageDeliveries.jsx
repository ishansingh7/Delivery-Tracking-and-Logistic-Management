import { useState, useEffect } from "react";
import axios from "axios";

const ManageDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    unassigned: 0,
  });

  useEffect(() => {
    fetchAllDeliveries();

    const pollInterval = setInterval(() => {
      fetchAllDeliveries();
    }, 3000);

    return () => clearInterval(pollInterval);
  }, []);

  const fetchAllDeliveries = async () => {
    try {
      const [domesticRes, internationalRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/deliveries"),
        axios.get("http://localhost:5000/api/admin/international/deliveries")
      ]);

      const domestic = Array.isArray(domesticRes.data) ? domesticRes.data.map(d => ({ ...d, type: "Domestic" })) : [];
      const international = Array.isArray(internationalRes.data) ? internationalRes.data.map(d => ({ ...d, type: "International" })) : [];

      const allDeliveries = [...domestic, ...international].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const counts = allDeliveries.reduce((acc, delivery) => {
        const status = (delivery.deliveryStatus || "Pending").toLowerCase();
        const approval = (delivery.approvalStatus || "Pending").toLowerCase();

        if (approval === "approved") acc.approved += 1;
        if (status === "delivered") acc.delivered += 1;
        if (status === "in transit" || status === "out for delivery") acc.inTransit += 1;
        if (status === "pending" || status === "processing") acc.pending += 1;
        if (!delivery.deliveryPersonName && !delivery.assignedTo) acc.unassigned += 1;
        acc.total += 1;
        return acc;
      }, {
        total: 0,
        approved: 0,
        pending: 0,
        inTransit: 0,
        delivered: 0,
        unassigned: 0,
      });

      setDeliveries(allDeliveries);
      setStats(counts);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    }
  };

  const viewDetails = (delivery) => {
    setSelectedDelivery(delivery);
  };

  const closeModal = () => {
    setSelectedDelivery(null);
  };

  return (
    <div className="admin-container">
      <h1>📦 Manage All Deliveries</h1>

      <div className="dashboard-summary" style={{ marginBottom: "20px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "16px" }}>
        <div className="summary-card">
          <h4>Total Orders</h4>
          <p>{stats.total}</p>
        </div>
        <div className="summary-card">
          <h4>Approved</h4>
          <p>{stats.approved}</p>
        </div>
        <div className="summary-card">
          <h4>In Transit</h4>
          <p>{stats.inTransit}</p>
        </div>
        <div className="summary-card">
          <h4>Delivered</h4>
          <p>{stats.delivered}</p>
        </div>
        <div className="summary-card">
          <h4>Pending</h4>
          <p>{stats.pending}</p>
        </div>
        <div className="summary-card">
          <h4>Unassigned</h4>
          <p>{stats.unassigned}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr className="table-top-head">
            <th>Tracking ID</th>
            <th>Type</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Agent</th>
            <th>Status</th>
            <th>Approval</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {deliveries.map((d) => (
            <tr className="table-data" key={d._id}>
              <td>{d.trackingId}</td>
              <td>
                <span className="type-badge" style={{
                  backgroundColor: d.type === "Domestic" ? "#e0f2fe" : "#fce7f3",
                  color: d.type === "Domestic" ? "#0369a1" : "#be185d",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "600"
                }}>
                  {d.type}
                </span>
              </td>
              <td>{d.senderName}</td>
              <td>{d.receiverName}</td>
              <td>
                {d.deliveryPersonName ? (
                  <span style={{ color: "#059669", fontWeight: "600" }}>
                    {d.deliveryPersonName}
                  </span>
                ) : (
                  <span style={{ color: "#999" }}>Not Assigned</span>
                )}
              </td>
              <td>
                <span className="status-badge" style={{
                  backgroundColor: 
                    d.deliveryStatus === "Delivered" ? "#dcfce7" :
                    d.deliveryStatus === "In Transit" ? "#e0f2fe" :
                    d.deliveryStatus === "Out for Delivery" ? "#fef08a" :
                    "#fee2e2",
                  color:
                    d.deliveryStatus === "Delivered" ? "#166534" :
                    d.deliveryStatus === "In Transit" ? "#0369a1" :
                    d.deliveryStatus === "Out for Delivery" ? "#b45309" :
                    "#991b1b",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "600"
                }}>
                  {d.deliveryStatus || "Pending"}
                </span>
              </td>
              <td>{d.approvalStatus || "Pending"}</td>
              <td>
                <button className="view-btn" onClick={() => viewDetails(d)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDelivery && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                Delivery Details <span style={{ fontSize: "14px", opacity: 0.7 }}>({selectedDelivery.type})</span>
              </h2>
              <span className="close-btn" onClick={closeModal}>✖</span>
            </div>

            <div className="details-grid">
              <div className="detail-card">
                <h3>📍 Tracking Info</h3>
                <p><strong>Tracking ID:</strong> {selectedDelivery.trackingId}</p>
                <p><strong>Approval Status:</strong> {selectedDelivery.approvalStatus || "Pending"}</p>
                <p><strong>Delivery Status:</strong> {selectedDelivery.deliveryStatus || "Pending"}</p>
                <p><strong>Payment Method:</strong> {selectedDelivery.paymentMethod || "N/A"}</p>
              </div>

              {selectedDelivery.deliveryPersonName && (
                <div className="detail-card">
                  <h3>👨‍💼 Assigned Delivery Agent</h3>
                  {selectedDelivery.deliveryPersonPhoto && (
                    <div style={{ marginBottom: "12px", textAlign: "center" }}>
                      <img
                        src={selectedDelivery.deliveryPersonPhoto.startsWith("http") ? selectedDelivery.deliveryPersonPhoto : `http://localhost:5000/uploads/${selectedDelivery.deliveryPersonPhoto}`}
                        alt={selectedDelivery.deliveryPersonName}
                        style={{ width: "120px", height: "120px", borderRadius: "8px", objectFit: "cover", border: "2px solid #0ea5e9" }}
                      />
                    </div>
                  )}
                  <p><strong>Name:</strong> {selectedDelivery.deliveryPersonName}</p>
                  <p><strong>Phone:</strong> {selectedDelivery.deliveryPersonPhone}</p>
                  <p><strong>License:</strong> {selectedDelivery.deliveryPersonLicense}</p>
                  <p><strong>Assigned At:</strong> {selectedDelivery.assignedAt ? new Date(selectedDelivery.assignedAt).toLocaleString() : "N/A"}</p>
                </div>
              )}

              <div className="detail-card">
                <h3>📍 Sender Information</h3>
                <p><strong>Name:</strong> {selectedDelivery.senderName}</p>
                <p><strong>Phone:</strong> {selectedDelivery.senderPhone}</p>
                {selectedDelivery.senderEmail && <p><strong>Email:</strong> {selectedDelivery.senderEmail}</p>}
                <p><strong>Full Address:</strong></p>
                <div className="address-box">
                  {selectedDelivery.senderAddress}
                  {selectedDelivery.senderCountry && `, ${selectedDelivery.senderCountry}`}
                </div>
              </div>

              <div className="detail-card">
                <h3>🎯 Receiver Information</h3>
                <p><strong>Name:</strong> {selectedDelivery.receiverName}</p>
                <p><strong>Phone:</strong> {selectedDelivery.receiverPhone}</p>
                {selectedDelivery.receiverEmail && <p><strong>Email:</strong> {selectedDelivery.receiverEmail}</p>}
                <p><strong>Full Address:</strong></p>
                <div className="address-box">
                  {selectedDelivery.receiverAddress}
                  {selectedDelivery.receiverCountry && `, ${selectedDelivery.receiverCountry}`}
                </div>
              </div>

              <div className="detail-card">
                <h3>📦 Shipment Details</h3>
                <p><strong>Origin City:</strong> {selectedDelivery.originCity}</p>
                <p><strong>Destination City:</strong> {selectedDelivery.destinationCity}</p>
                <p><strong>Package Type:</strong> {selectedDelivery.packageType}</p>
                <p><strong>Weight:</strong> {selectedDelivery.weight} kg</p>
                {selectedDelivery.itemDescription && <p><strong>Description:</strong> {selectedDelivery.itemDescription}</p>}
                {selectedDelivery.itemValue && <p><strong>Value:</strong> ${selectedDelivery.itemValue}</p>}
              </div>

              {(selectedDelivery.lastLocation || selectedDelivery.trackingNotes) && (
                <div className="detail-card">
                  <h3>📍 Latest Updates</h3>
                  {selectedDelivery.lastLocation && <p><strong>Last Location:</strong> {selectedDelivery.lastLocation}</p>}
                  {selectedDelivery.trackingNotes && <p><strong>Notes:</strong> {selectedDelivery.trackingNotes}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDeliveries;