import React, { useEffect, useState } from "react";
import "./Admin.css";

const AdminDashboard = () => {

  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    fetchDeliveries();

    // Set up real-time polling - refresh every 3 seconds
    const pollInterval = setInterval(() => {
      fetchDeliveries();
    }, 3000);

    return () => clearInterval(pollInterval);
  }, []);

  const fetchDeliveries = async () => {

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const res = await fetch(`${API_URL}/api/admin/deliveries`);
    const data = await res.json();

    setDeliveries(data);
  };

  const approve = async (id) => {

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    await fetch(`${API_URL}/api/admin/approve/${id}`, {
      method: "PUT"
    });

    fetchDeliveries();
  };

  const reject = async (id) => {

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    await fetch(`${API_URL}/api/admin/reject/${id}`, {
      method: "PUT"
    });

    fetchDeliveries();
  };

  const deleteDelivery = async (id) => {

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    await fetch(`${API_URL}/api/admin/delete/${id}`, {
      method: "DELETE"
    });

    fetchDeliveries();
  };

  const viewDetails = (delivery) => {
    setSelectedDelivery(delivery);
  };

  const closeModal = () => {
    setSelectedDelivery(null);
  };

  return (

    <div className="admin-container">

      <h1>Courier Admin Dashboard</h1>

      <table>

        <thead>

          <tr className="table-top-head">
            <th>Tracking ID</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Delivery Agent</th>
            <th>Delivery Status</th>
            <th>Approval</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {deliveries.map((d) => (

            <tr className="table-data" key={d._id}>

              <td>{d.trackingId}</td>
              <td>{d.senderName}</td>
              <td>{d.receiverName}</td>
              <td>{d.deliveryPersonName ? d.deliveryPersonName : <span style={{color: "#999"}}>Not Assigned</span>}</td>
              <td>{d.deliveryStatus}</td>
              <td>{d.approvalStatus}</td>
              <td>{d.paymentMethod}</td>

              <td>

                <button className="view-btn" onClick={() => viewDetails(d)}>
                  View
                </button>

                <button className="approve-btn" onClick={() => approve(d._id)}>
                  Approve
                </button>

                <button className="reject-btn" onClick={() => reject(d._id)}>
                  Reject
                </button>

                <button className="delete-btn" onClick={() => deleteDelivery(d._id)}>
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* VIEW DETAILS MODAL */}

      {selectedDelivery && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>Shipment Details</h2>

              <span className="close-btn" onClick={closeModal}>✖</span>

            </div>

            <div className="details-grid">

              {/* TRACKING */}

              <div className="detail-card">

                <h3>Tracking Info</h3>

                <p><strong>Tracking ID:</strong> {selectedDelivery.trackingId}</p>

                <p><strong>Approval Status:</strong> {selectedDelivery.approvalStatus}</p>

                <p><strong>Delivery Status:</strong> {selectedDelivery.deliveryStatus}</p>

                <p><strong>Payment Method:</strong> {selectedDelivery.paymentMethod}</p>

              </div>

              {/* DELIVERY AGENT */}
              {selectedDelivery.deliveryPersonName && (
                <div className="detail-card">

                  <h3>👨‍💼 Assigned Delivery Agent</h3>

                  {selectedDelivery.deliveryPersonPhoto && (
                    <div style={{ marginBottom: "12px", textAlign: "center" }}>
                      <img
                        src={selectedDelivery.deliveryPersonPhoto.startsWith("http") ? selectedDelivery.deliveryPersonPhoto : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${selectedDelivery.deliveryPersonPhoto}`}
                        alt={selectedDelivery.deliveryPersonName}
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "2px solid #ff6a00"
                        }}
                      />
                    </div>
                  )}

                  <p><strong>Name:</strong> {selectedDelivery.deliveryPersonName}</p>

                  <p><strong>Phone:</strong> {selectedDelivery.deliveryPersonPhone}</p>

                  <p><strong>License:</strong> {selectedDelivery.deliveryPersonLicense}</p>

                  <p><strong>Assigned At:</strong> {new Date(selectedDelivery.assignedAt).toLocaleString()}</p>

                </div>
              )}


              {/* SENDER */}

              <div className="detail-card">

                <h3>Sender Information</h3>

                <p><strong>Name:</strong> {selectedDelivery.senderName}</p>

                <p><strong>Phone:</strong> {selectedDelivery.senderPhone}</p>

                <p><strong>Full Address:</strong></p>

                <div className="address-box">
                  {selectedDelivery.senderAddress}
                </div>

              </div>


              {/* RECEIVER */}

              <div className="detail-card">

                <h3>Receiver Information</h3>

                <p><strong>Name:</strong> {selectedDelivery.receiverName}</p>

                <p><strong>Phone:</strong> {selectedDelivery.receiverPhone}</p>

                <p><strong>Full Address:</strong></p>

                <div className="address-box">
                  {selectedDelivery.receiverAddress}
                </div>

              </div>


              {/* SHIPMENT DETAILS */}

              <div className="detail-card">

                <h3>Shipment Details</h3>

                <p><strong>Origin City:</strong> {selectedDelivery.originCity}</p>

                <p><strong>Destination City:</strong> {selectedDelivery.destinationCity}</p>

                <p><strong>Package Type:</strong> {selectedDelivery.packageType}</p>

                <p><strong>Weight:</strong> {selectedDelivery.weight} kg</p>

                <p><strong>Delivery Type:</strong> {selectedDelivery.deliveryType}</p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default AdminDashboard;