import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileCard from "./ProfileCard";
import EditProfile from "./EditProfile";
import "./css/Home.css";

function Home() {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Optionally fetch fresh data from backend if user has ID
        if (parsedUser._id || parsedUser.id) {
          const userId = parsedUser._id || parsedUser.id;
          axios.get(`http://localhost:5000/api/delivery/auth/profile/${userId}`)
            .then(response => {
              console.log("Fresh user data fetched:", response.data.user);
              setUser(response.data.user);
            })
            .catch(err => {
              console.log("Could not fetch fresh user data, using cached:", err);
            });
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    } else {
      // Redirect to login if no user data
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = (updatedUser) => {
    console.log("Profile saved, updating user:", updatedUser);
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo-section">
          <h2>🚚 DeliExpress</h2>
        </div>
        <ul>
          <li 
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile
          </li>
          <li 
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </li>
          <li>📦 My Orders</li>
          <li>💰 Earnings</li>
          <li>⚙️ Settings</li>
          <li onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="main">

        {/* HEADER */}
        <div className="header">
          <h2>Welcome, {user?.name}! 👋</h2>
          <div className="user">
            <span>{user?.name}</span>
            <img 
              src={user?.photo ? (user.photo.startsWith("http") ? user.photo : `http://localhost:5000/uploads/${user.photo}`) : "https://via.placeholder.com/50"} 
              alt="profile"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/50";
              }}
            />
          </div>
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="profile-section">
            <ProfileCard 
              user={user} 
              onEditClick={handleEditClick}
            />
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <>
            {/* STATS */}
            <div className="stats">
              <div className="card">
                <h3>15</h3>
                <p>Total Orders</p>
              </div>

              <div className="card">
                <h3>10</h3>
                <p>Delivered</p>
              </div>

              <div className="card">
                <h3>5</h3>
                <p>Pending</p>
              </div>

              <div className="card">
                <h3>₹2500</h3>
                <p>Earnings</p>
              </div>
            </div>

            {/* ACTIVE ORDERS */}
            <div className="orders">
              <h3>Active Deliveries</h3>

              <div className="order">
                <div>
                  <p><strong>Order #101</strong></p>
                  <p>Pickup: Restaurant A</p>
                  <p>Drop: Customer Location</p>
                </div>
                <button>Start</button>
              </div>

              <div className="order">
                <div>
                  <p><strong>Order #102</strong></p>
                  <p>Pickup: Warehouse B</p>
                  <p>Drop: Office Area</p>
                </div>
                <button>Start</button>
              </div>

            </div>
          </>
        )}

      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfile 
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}

export default Home;