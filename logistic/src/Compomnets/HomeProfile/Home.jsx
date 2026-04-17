import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileCard from "./ProfileCard";
import EditProfile from "./EditProfile";
import "./css/Home.css";

function Home() {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
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
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          axios.get(`${API_URL}/api/delivery/auth/profile/${userId}`)
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
    <div>

      {/* MAIN CONTENT */}

        {/* HEADER */}
        <div className="header">
          <h2>Welcome, {user?.name}! 👋</h2>
          <div className="user">
            <span>{user?.name}</span>
            <img 
              src={user?.photo ? (user.photo.startsWith("http") ? user.photo : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${user.photo}`) : "https://via.placeholder.com/50"} 
              alt="profile"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/50";
              }}
            />
          </div>
        </div>

        {/* PROFILE SECTION */}
        <div className="profile-section">
          <ProfileCard 
            user={user} 
            onEditClick={handleEditClick}
          />
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