import { useState } from "react";
import "./css/ProfileCard.css";

function ProfileCard({ user, onEditClick }) {
  const [photoError, setPhotoError] = useState(false);
  const [licenseError, setLicenseError] = useState(false);

  const getPhotoUrl = () => {
    if (!user?.photo) return "https://via.placeholder.com/150?text=No+Photo";
    
    // If it's already a full URL, return it
    if (user.photo.startsWith("http")) return user.photo;
    
    // Otherwise construct the full URL
    return `http://localhost:5000/uploads/${user.photo}`;
  };

  const handlePhotoError = () => {
    console.log("Photo failed to load:", user?.photo);
    setPhotoError(true);
  };

  const handleLicenseError = () => {
    console.log("License image failed to load:", user?.licenseImage);
    setLicenseError(true);
  };

  return (
    <div className="profile-card">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-photo-container">
          <img 
            src={photoError ? "https://via.placeholder.com/150?text=No+Photo" : getPhotoUrl()} 
            alt={user?.name || "Profile"}
            className="profile-photo"
            onError={handlePhotoError}
          />
          <div className={`badge ${user?.verified ? 'verified' : 'unverified'}`}>
            {user?.verified ? '✓ Verified' : '⏳ Pending'}
          </div>
        </div>
        <div className="profile-info">
          <h2>{user?.name || "Delivery Agent"}</h2>
          <p className="email">{user?.email || "email@example.com"}</p>
          <p className="phone">📱 {user?.phone || "Not provided"}</p>
          <p className="location">📍 {user?.city || "Location not set"}</p>
          {user?.verified && user?.verifiedAt && (
            <p className="verified-date">
              ✓ Verified on {new Date(user.verifiedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
              {user?.verifiedBy && ` by ${user.verifiedBy}`}
            </p>
          )}
        </div>
      </div>

      {/* Profile Details */}
      <div className="profile-details">
        <div className="detail-item">
          <span className="label">License Number:</span>
          <span className="value">{user?.licenseNumber || "Not verified"}</span>
        </div>
        <div className="detail-item">
          <span className="label">Full Address:</span>
          <span className="value">{user?.address || "Not provided"}</span>
        </div>
        <div className="detail-item">
          <span className="label">Member Since:</span>
          <span className="value">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="profile-actions">
        <button className="btn-primary" onClick={onEditClick}>
          ✏️ Edit Profile
        </button>
        <button className="btn-secondary">
          🔒 Change Password
        </button>
      </div>

      {/* License Image */}
      {user?.licenseImage && !licenseError && (
        <div className="license-section">
          <h4>License Image</h4>
          <img 
            src={user.licenseImage.startsWith("http") ? user.licenseImage : `http://localhost:5000/uploads/${user.licenseImage}`}
            alt="License" 
            className="license-image"
            onError={handleLicenseError}
          />
        </div>
      )}
    </div>
  );
}

export default ProfileCard;
