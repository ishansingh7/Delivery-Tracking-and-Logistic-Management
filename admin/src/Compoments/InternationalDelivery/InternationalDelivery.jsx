import React, { useEffect, useState } from "react";
import "./internationaldelivery.css";

const AdminInternationalDashboard = () => {

  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {

    const res = await fetch(
      "http://localhost:5000/api/admin/international/deliveries"
    );

    const data = await res.json();

    setDeliveries(data);
  };

  const approve = async (id) => {

    await fetch(
      `http://localhost:5000/api/admin/international/approve/${id}`,
      { method: "PUT" }
    );

    fetchDeliveries();
  };

  const reject = async (id) => {

    await fetch(
      `http://localhost:5000/api/admin/international/reject/${id}`,
      { method: "PUT" }
    );

    fetchDeliveries();
  };

  const deleteDelivery = async (id) => {

    await fetch(
      `http://localhost:5000/api/admin/international/delete/${id}`,
      { method: "DELETE" }
    );

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

      <h1>International Shipment Dashboard</h1>

      <table>

        <thead>

          <tr>
            <th>Tracking ID</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Status</th>
            <th>Approval</th>
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

              <td>

                <button
                  className="view-btn"
                  onClick={() => viewDetails(d)}
                >
                  View
                </button>

                <button
                  className="approve-btn"
                  onClick={() => approve(d._id)}
                >
                  Approve
                </button>

                <button
                  className="reject-btn"
                  onClick={() => reject(d._id)}
                >
                  Reject
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteDelivery(d._id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* MODAL */}

      {selectedDelivery && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>International Shipment Details</h2>

              <span
                className="close-btn"
                onClick={closeModal}
              >
                ✖
              </span>

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

                <p><strong>Email:</strong> {selectedDelivery.senderEmail}</p>

                <p><strong>Country:</strong> {selectedDelivery.senderCountry}</p>

                <p><strong>Address:</strong></p>

                <div className="address-box">
                  {selectedDelivery.senderAddress}
                </div>

              </div>


              {/* RECEIVER */}

              <div className="detail-card">

                <h3>Receiver Information</h3>

                <p><strong>Name:</strong> {selectedDelivery.receiverName}</p>

                <p><strong>Phone:</strong> {selectedDelivery.receiverPhone}</p>

                <p><strong>Email:</strong> {selectedDelivery.receiverEmail}</p>

                <p><strong>Country:</strong> {selectedDelivery.receiverCountry}</p>

                <p><strong>Address:</strong></p>

                <div className="address-box">
                  {selectedDelivery.receiverAddress}
                </div>

              </div>


              {/* SHIPMENT */}

              <div className="detail-card">

                <h3>Shipment Details</h3>

                <p><strong>Origin City:</strong> {selectedDelivery.originCity}</p>

                <p><strong>Destination City:</strong> {selectedDelivery.destinationCity}</p>

                <p><strong>Package Type:</strong> {selectedDelivery.packageType}</p>

                <p><strong>Weight:</strong> {selectedDelivery.weight} kg</p>

                <p><strong>Dimensions:</strong> {selectedDelivery.length} × {selectedDelivery.width} × {selectedDelivery.height} cm</p>

                <p><strong>Item Description:</strong> {selectedDelivery.itemDescription}</p>

                <p><strong>Declared Value:</strong> ${selectedDelivery.itemValue}</p>

                <p><strong>Delivery Type:</strong> {selectedDelivery.deliveryType}</p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default AdminInternationalDashboard;