import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import L from "leaflet";
import "./TrackDelivery.css";

// Fix Leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const TrackShipment = () => {
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const trackShipment = async () => {
    if (!trackingId.trim()) {
      setError("Please enter Tracking ID");
      return;
    }

    setLoading(true);
    setError("");
    setShipment(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/track/${trackingId}`
      );

      if (!res.ok) {
        throw new Error("Tracking ID not found");
      }

      const data = await res.json();

      setShipment(data);
      setError("");
    } catch (err) {
      setShipment(null);
      setError("Tracking ID not found");
    } finally {
      setLoading(false);
    }
  };

  // Timeline steps
  const steps = [
    "Order Created",
    "Approved",
    "Picked Up",
    "In Transit",
    "Out For Delivery",
    "Delivered",
  ];

  const getCurrentStep = () => {
    if (!shipment) return 0;

    const status = shipment.deliveryStatus?.toLowerCase() || "";
    const approval = shipment.approvalStatus?.toLowerCase() || "";

    if (status.includes("delivered")) return 5;
    if (status.includes("out for delivery")) return 4;
    if (status.includes("transit")) return 3;
    if (status.includes("picked")) return 2;
    if (approval.includes("approved")) return 1;

    return 0;
  };

  const currentStep = getCurrentStep();

  // Example coordinates (replace with real DB values if available)
  const origin = shipment
    ? [shipment.originLat || 28.6139, shipment.originLng || 77.209]
    : null;

  const destination = shipment
    ? [shipment.destinationLat || 19.076, shipment.destinationLng || 72.8777]
    : null;

  const showMap = origin && destination;

  return (
    <div className="track-container">

      <h1>Track Your Shipment</h1>

      <div className="track-box">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && trackShipment()}
        />

        <button onClick={trackShipment} disabled={loading}>
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin /> Tracking...
            </>
          ) : (
            "Track"
          )}
        </button>
      </div>

      {error && (
        <p className="error">
          <FontAwesomeIcon icon={faTimesCircle} /> {error}
        </p>
      )}

      {shipment && (
        <div className="tracking-result">

          <h2>Shipment Details</h2>

          <p><strong>Tracking ID:</strong> {shipment.trackingId}</p>
          <p><strong>Sender:</strong> {shipment.senderName}</p>
          <p><strong>Receiver:</strong> {shipment.receiverName}</p>
          <p><strong>Origin:</strong> {shipment.originCity}</p>
          <p><strong>Destination:</strong> {shipment.destinationCity}</p>
          <p><strong>Approval Status:</strong> {shipment.approvalStatus}</p>
          <p><strong>Delivery Status:</strong> {shipment.deliveryStatus}</p>

          {/* Timeline */}
          <div className="timeline">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`step ${index <= currentStep ? "active" : ""}`}
              >
                <FontAwesomeIcon
                  icon={index >= 2 ? faTruck : faCheckCircle}
                />
                {step}
              </div>
            ))}
          </div>

          {/* Map */}
          {showMap && (
            <div className="map-section">
              <h3>Shipment Route</h3>

              <MapContainer
                center={origin}
                zoom={5}
                style={{ height: "400px", width: "100%", marginTop: "20px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap"
                />

                <Marker position={origin}>
                  <Popup>Origin: {shipment.originCity}</Popup>
                </Marker>

                <Marker position={destination}>
                  <Popup>Destination: {shipment.destinationCity}</Popup>
                </Marker>

                <Polyline positions={[origin, destination]} />
              </MapContainer>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default TrackShipment;