import { useState, useEffect } from "react";
import "./DeliveryAgents.css";

export default function DeliveryAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchDeliveryAgents();

    // Set up real-time polling - refresh every 5 seconds
    const pollInterval = setInterval(() => {
      fetchDeliveryAgents();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  const fetchDeliveryAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/delivery/auth/all-agents");
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.agents && Array.isArray(data.agents)) {
        setAgents(data.agents);
        console.log("Agents fetched successfully:", data.agents);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching agents:", err);
      setAgents([]);
      alert(`Failed to load delivery agents: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.phone.includes(searchTerm)
  );

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "email") return a.email.localeCompare(b.email);
    if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  const handleViewDetails = (agent) => {
    setSelectedAgent(agent);
    setShowModal(true);
  };

  const handleVerify = async (agentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/delivery/auth/verify-agent/${agentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminName: "Admin" })
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSelectedAgent(data.user);
      setAgents(agents.map(a => a._id === agentId ? data.user : a));
      alert("Agent verified successfully!");
    } catch (err) {
      console.error("Error verifying agent:", err);
      alert("Error verifying agent: " + err.message);
    }
  };

  const handleUnverify = async (agentId) => {
    if (window.confirm("Are you sure you want to unverify this agent?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/delivery/auth/unverify-agent/${agentId}`,
          { method: "PUT" }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setSelectedAgent(data.user);
        setAgents(agents.map(a => a._id === agentId ? data.user : a));
        alert("Agent unverified successfully!");
      } catch (err) {
        console.error("Error unverifying agent:", err);
        alert("Error unverifying agent: " + err.message);
      }
    }
  };

  const handleDelete = async (agentId) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/delivery/auth/delete-agent/${agentId}`, {
          method: "DELETE"
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        setAgents(agents.filter(a => a._id !== agentId));
        setShowModal(false);
        alert("Agent deleted successfully");
      } catch (err) {
        console.error("Error deleting agent:", err);
        alert("Error deleting agent: " + err.message);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading delivery agents...</div>;
  }

  return (
    <div className="delivery-agents-container">
      <div className="agents-header">
        <h1>👥 Delivery Agents Management</h1>
        <p>Total Agents: <strong>{agents.length}</strong></p>
      </div>

      <div className="agents-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="sort-box">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name (A-Z)</option>
            <option value="email">Email</option>
            <option value="date">Join Date (Newest)</option>
          </select>
        </div>

        <button className="refresh-btn" onClick={fetchDeliveryAgents}>
          🔄 Refresh
        </button>
      </div>

      <div className="agents-grid">
        {sortedAgents.length > 0 ? (
          sortedAgents.map((agent) => (
            <div key={agent._id} className="agent-card">
              <div className="agent-photo-container">
                <img
                  src={
                    agent.photo?.startsWith("http")
                      ? agent.photo
                      : agent.photo
                      ? `http://localhost:5000/uploads/${agent.photo}`
                      : "https://via.placeholder.com/150?text=No+Photo"
                  }
                  alt={agent.name}
                  className="agent-photo"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=No+Photo";
                  }}
                />
                <div className={`agent-badge ${agent.verified ? 'verified' : 'unverified'}`}>
                  {agent.verified ? '✓ Verified' : '⏳ Pending'}
                </div>
              </div>

              <div className="agent-info">
                <h3>{agent.name}</h3>
                <p className="email"><strong>📧</strong> {agent.email}</p>
                <p className="phone"><strong>📱</strong> {agent.phone || "Not provided"}</p>
                <div className="agent-actions">
                  <button className="btn-view" onClick={() => handleViewDetails(agent)}>
                    👁️ View Details
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(agent._id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-agents">
            <p>No delivery agents found</p>
          </div>
        )}
      </div>

      {showModal && selectedAgent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ✕
            </button>

            <div className="modal-header">
              <img
                src={
                  selectedAgent.photo?.startsWith("http")
                    ? selectedAgent.photo
                    : selectedAgent.photo
                    ? `http://localhost:5000/uploads/${selectedAgent.photo}`
                    : "https://via.placeholder.com/200?text=No+Photo"
                }
                alt={selectedAgent.name}
                className="modal-photo"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/200?text=No+Photo";
                }}
              />
              <div className="modal-title">
                <h2>{selectedAgent.name}</h2>
                <p className="role">🚚 Delivery Agent</p>
                <p className={`verification-badge ${selectedAgent.verified ? 'verified' : 'unverified'}`}>
                  {selectedAgent.verified ? '✓ Verified Profile' : '⏳ Pending Verification'}
                </p>
              </div>
            </div>

            <div className="modal-details">
              <div className="detail-section">
                <h4>📋 Personal Information</h4>
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{selectedAgent.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{selectedAgent.email}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span className="value">{selectedAgent.phone || "Not provided"}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>📍 Location Information</h4>
                <div className="detail-row">
                  <span className="label">City:</span>
                  <span className="value">{selectedAgent.city || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Address:</span>
                  <span className="value">{selectedAgent.address || "Not provided"}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Latitude:</span>
                  <span className="value">{selectedAgent.latitude || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Longitude:</span>
                  <span className="value">{selectedAgent.longitude || "N/A"}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>📜 License Information</h4>
                <div className="detail-row">
                  <span className="label">License Number:</span>
                  <span className="value">{selectedAgent.licenseNumber || "Not provided"}</span>
                </div>
              </div>

              {selectedAgent.licenseImage && (
                <div className="detail-section">
                  <h4>📸 License Image</h4>
                  <img
                    src={
                      selectedAgent.licenseImage?.startsWith("http")
                        ? selectedAgent.licenseImage
                        : `http://localhost:5000/uploads/${selectedAgent.licenseImage}`
                    }
                    alt="License"
                    className="license-image"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="detail-section">
                <h4>📅 Membership</h4>
                <div className="detail-row">
                  <span className="label">Member Since:</span>
                  <span className="value">
                    {selectedAgent.createdAt
                      ? new Date(selectedAgent.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Last Updated:</span>
                  <span className="value">
                    {selectedAgent.updatedAt
                      ? new Date(selectedAgent.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h4>✅ Verification Status</h4>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className={`status-badge ${selectedAgent.verified ? 'verified' : 'unverified'}`}>
                    {selectedAgent.verified ? '✓ Verified' : '⏳ Not Verified'}
                  </span>
                </div>
                {selectedAgent.verified && selectedAgent.verifiedAt && (
                  <>
                    <div className="detail-row">
                      <span className="label">Verified At:</span>
                      <span className="value">
                        {new Date(selectedAgent.verifiedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Verified By:</span>
                      <span className="value">{selectedAgent.verifiedBy || "Admin"}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-close" onClick={() => setShowModal(false)}>
                Close
              </button>
              {!selectedAgent.verified ? (
                <button
                  className="btn-verify"
                  onClick={() => handleVerify(selectedAgent._id)}
                >
                  ✓ Verify Agent
                </button>
              ) : (
                <button
                  className="btn-unverify"
                  onClick={() => handleUnverify(selectedAgent._id)}
                >
                  ⊘ Unverify Agent
                </button>
              )}
              <button
                className="btn-delete-modal"
                onClick={() => {
                  handleDelete(selectedAgent._id);
                  setShowModal(false);
                }}
              >
                🗑️ Delete Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
