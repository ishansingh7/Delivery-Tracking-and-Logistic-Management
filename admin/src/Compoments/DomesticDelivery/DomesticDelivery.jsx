import React, { useEffect, useState } from "react";
import "./Admin.css";

const AdminDashboard = () => {

  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {

    const res = await fetch("http://localhost:5000/api/admin/deliveries");
    const data = await res.json();

    setDeliveries(data);
  };

  const approve = async (id) => {

    await fetch(`http://localhost:5000/api/admin/approve/${id}`, {
      method: "PUT"
    });

    fetchDeliveries();
  };

  const reject = async (id) => {

    await fetch(`http://localhost:5000/api/admin/reject/${id}`, {
      method: "PUT"
    });

    fetchDeliveries();
  };

  const deleteDelivery = async (id) => {

    await fetch(`http://localhost:5000/api/admin/delete/${id}`, {
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

          <tr>
            <th>Tracking ID</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Delivery Status</th>
            <th>Approval</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {deliveries.map((d) => (

            <tr key={d._id}>

              <td>{d.trackingId}</td>
              <td>{d.senderName}</td>
              <td>{d.receiverName}</td>
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