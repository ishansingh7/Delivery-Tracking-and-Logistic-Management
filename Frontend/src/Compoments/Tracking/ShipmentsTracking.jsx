import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faBox,
} from "@fortawesome/free-solid-svg-icons";
import L from "leaflet";
import "./tracking.css";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom markers
const originIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
});

const TrackShipment = () => {
  const { trackingId } = useParams();

  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch Data
  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/track/${trackingId}`);
        if (!res.ok) throw new Error("Shipment not found");

        const data = await res.json();
        setShipment(data);
      } catch (err) {
        setError("Tracking ID not found");
      } finally {
        setLoading(false);
      }
    };

    if (trackingId) fetchShipment();
  }, [trackingId]);

  // 📊 Timeline Steps
  const steps = [
    { label: "Order Placed", icon: faBox },
    { label: "Approved", icon: faCheckCircle },
    { label: "Picked Up", icon: faTruck },
    { label: "In Transit", icon: faTruck },
    { label: "Out for Delivery", icon: faTruck },
    { label: "Delivered", icon: faCheckCircle },
  ];

  // 🔥 Get current step
  const getCurrentStep = () => {
    if (!shipment) return 0;

    const status = shipment.deliveryStatus?.toLowerCase() || "";

    if (status.includes("delivered")) return 5;
    if (status.includes("out for delivery")) return 4;
    if (status.includes("transit")) return 3;
    if (status.includes("picked")) return 2;

    return 1;
  };

  const currentStep = getCurrentStep();
  const progress = ((currentStep + 1) / steps.length) * 100;

  // 📍 Map Coordinates
  const origin = shipment
    ? [shipment.originLat || 28.6139, shipment.originLng || 77.209]
    : null;

  const destination = shipment
    ? [shipment.destinationLat || 19.076, shipment.destinationLng || 72.8777]
    : null;

  if (loading) {
    return (
      <div className="track-page">
        <h2><FontAwesomeIcon icon={faSpinner} spin /> Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="track-page error-message">
        <FontAwesomeIcon icon={faTimesCircle} />
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="track-page">
      <div className="track-container">

        {/* STATUS CARD */}
        <div className="status-card">
          <h2>{shipment.deliveryStatus}</h2>
          <p><strong>Tracking ID:</strong> {shipment.trackingId}</p>

          <div className="details-grid">
            <div>
              <strong>Sender</strong>
              <p>{shipment.senderName}</p>
            </div>
            <div>
              <strong>Receiver</strong>
              <p>{shipment.receiverName}</p>
            </div>
            <div>
              <strong>From</strong>
              <p>{shipment.originCity}</p>
            </div>
            <div>
              <strong>To</strong>
              <p>{shipment.destinationCity}</p>
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="timeline-section">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
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
                <p>{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MAP */}
        {origin && destination && (
          <MapContainer center={origin} zoom={5} style={{ height: "400px", borderRadius: "12px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={origin} icon={originIcon}>
              <Popup>{shipment.originCity}</Popup>
            </Marker>
            <Marker position={destination} icon={destinationIcon}>
              <Popup>{shipment.destinationCity}</Popup>
            </Marker>
            <Polyline positions={[origin, destination]} />
          </MapContainer>
        )}

      </div>
    </div>
  );
};

export default TrackShipment;