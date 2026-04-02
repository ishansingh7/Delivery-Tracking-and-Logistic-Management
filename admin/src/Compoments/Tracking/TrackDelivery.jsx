import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faBox,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import L from "leaflet";
import "./TrackDelivery.css";

// Fix Leaflet default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Icons for Origin and Destination
const originIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const TrackShipment = () => {
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const trackShipment = async () => {
    if (!trackingId.trim()) {
      setError("Please enter a valid Tracking ID");
      return;
    }

    setLoading(true);
    setError("");
    setShipment(null);

    try {
      const res = await fetch(`http://localhost:5000/api/track/${trackingId}`);
      
      if (!res.ok) {
        throw new Error("Shipment not found");
      }

      const data = await res.json();
      setShipment(data);
    } catch (err) {
      setError("Tracking ID not found. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Timeline Steps
  const steps = [
    { label: "Order Placed", icon: faBox },
    { label: "Approved", icon: faCheckCircle },
    { label: "Picked Up", icon: faTruck },
    { label: "In Transit", icon: faTruck },
    { label: "Out for Delivery", icon: faTruck },
    { label: "Delivered", icon: faCheckCircle },
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
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  // Coordinates
  const origin = shipment
    ? [shipment.originLat || 28.6139, shipment.originLng || 77.209]
    : null;

  const destination = shipment
    ? [shipment.destinationLat || 19.076, shipment.destinationLng || 72.8777]
    : null;

  const showMap = origin && destination;

  return (
    <div className="track-page">
      <div className="track-container">
        <div className="header">
          <h1>Track Your Shipment</h1>
          <p className="subtitle">Real-time visibility • Trusted by thousands</p>
        </div>

        {/* Tracking Input */}
        <div className="tracking-input">
          <div className="input-group">
            <FontAwesomeIcon icon={faLocationDot} className="input-icon" />
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g. TRK987654321)"
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
                "Track Shipment"
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <FontAwesomeIcon icon={faTimesCircle} />
            <span>{error}</span>
          </div>
        )}

        {shipment && (
          <div className="tracking-result">
            {/* Status Overview */}
            <div className="status-card">
              <div className="status-header">
                <div>
                  <h2>{shipment.deliveryStatus || "In Progress"}</h2>
                  <p className="tracking-id">
                    Tracking ID: <strong>{shipment.trackingId}</strong>
                  </p>
                </div>
                <div className={`status-badge ${shipment.deliveryStatus?.toLowerCase().replace(/\s+/g, "-") || "in-transit"}`}>
                  {shipment.deliveryStatus}
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <strong>Sender</strong>
                  <p>{shipment.senderName}</p>
                </div>
                <div className="detail-item">
                  <strong>Receiver</strong>
                  <p>{shipment.receiverName}</p>
                </div>
                <div className="detail-item">
                  <strong>Origin</strong>
                  <p>{shipment.originCity}</p>
                </div>
                <div className="detail-item">
                  <strong>Destination</strong>
                  <p>{shipment.destinationCity}</p>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="timeline-section">
              <h3>Shipment Progress</h3>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <div className="timeline">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`timeline-step ${index <= currentStep ? "completed" : ""} ${index === currentStep ? "current" : ""}`}
                  >
                    <div className="step-icon">
                      <FontAwesomeIcon icon={step.icon} />
                    </div>
                    <div className="step-label">{step.label}</div>
                    {index < steps.length - 1 && <div className="step-line"></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Map Section with Clear Origin & Destination */}
            {showMap && (
              <div className="map-section">
                <h3>Shipment Route</h3>
                <p className="map-subtitle">
                  <span style={{ color: "#22c55e" }}>● Origin</span> — 
                  <span style={{ color: "#ef4444" }}>● Destination</span>
                </p>

                <MapContainer
                  center={origin}
                  zoom={5}
                  style={{ height: "450px", width: "100%", borderRadius: "16px" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />

                  {/* Origin Marker - Green */}
                  <Marker position={origin} icon={originIcon}>
                    <Popup>
                      <strong>Origin</strong><br />
                      {shipment.originCity}<br />
                      {shipment.originAddress || "Pickup Location"}
                    </Popup>
                  </Marker>

                  {/* Destination Marker - Red */}
                  <Marker position={destination} icon={destinationIcon}>
                    <Popup>
                      <strong>Destination</strong><br />
                      {shipment.destinationCity}<br />
                      {shipment.destinationAddress || "Delivery Location"}
                    </Popup>
                  </Marker>

                  {/* Route Line */}
                  <Polyline
                    positions={[origin, destination]}
                    color="#4f46e5"
                    weight={5}
                    opacity={0.75}
                    dashArray="8, 6"
                  />
                </MapContainer>

                <div className="map-info">
                  <div className="info-item">
                    <strong>Distance:</strong> ~{shipment.distance || "1,450"} km
                  </div>
                  <div className="info-item">
                    <strong>Estimated Delivery:</strong> {shipment.estimatedDays || "3-5"} days
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackShipment;