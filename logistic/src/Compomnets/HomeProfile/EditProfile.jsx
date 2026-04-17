import { useState } from "react";
import axios from "axios";
import "./css/EditProfile.css";

function EditProfile({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    licenseNumber: user?.licenseNumber || ""
  });
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user?.photo);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = user?._id || user?.id;
      
      console.log("Submitting profile update for user:", userId);
      
      // Create FormData to handle file uploads
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name || "");
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("address", formData.address || "");
      formDataToSend.append("city", formData.city || "");
      formDataToSend.append("licenseNumber", formData.licenseNumber || "");

      // Get the file input and append the file if it exists
      const fileInput = document.querySelector('#photo-input');
      if (fileInput && fileInput.files && fileInput.files[0]) {
        console.log("Appending photo file:", fileInput.files[0].name);
        formDataToSend.append("photo", fileInput.files[0]);
      } else {
        console.log("No photo file selected");
      }

      // Log all FormData entries
      console.log("FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.put(
        `${API_URL}/api/delivery/auth/profile/${userId}`,
        formDataToSend,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      console.log("Update response:", response.data);

      // Update localStorage with new user data
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      alert("Profile updated successfully!");
      onSave(response.data.user);
      onClose();

    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response);
      alert(err.response?.data?.message || err.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          {/* Photo Section */}
          <div className="form-section">
            <h3>Profile Photo</h3>
            <div className="photo-upload">
              <div className="photo-preview">
                <img 
                  src={photoPreview || "https://via.placeholder.com/150?text=No+Photo"} 
                  alt="Preview"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=No+Photo";
                  }}
                />
              </div>
              <input 
                type="file" 
                id="photo-input"
                accept="image/*"
                onChange={handlePhotoChange}
                className="file-input"
              />
              <label htmlFor="photo-input" className="upload-label">
                📸 Choose Photo
              </label>
            </div>
          </div>

          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="form-section">
            <h3>Address Information</h3>

            <div className="form-group">
              <label htmlFor="address">Full Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                placeholder="Enter your full address"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city || ""}
                onChange={handleInputChange}
                required
                placeholder="Enter your city"
              />
            </div>
          </div>

          {/* License Information */}
          <div className="form-section">
            <h3>License Information</h3>

            <div className="form-group">
              <label htmlFor="licenseNumber">License Number</label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber || ""}
                onChange={handleInputChange}
                placeholder="Enter your license number"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-save"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
