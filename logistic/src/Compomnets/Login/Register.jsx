import { useState } from "react";
import axios from "axios";
import "./css/Register.css";

function Register() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setForm({ ...form, [e.target.name]: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      for (let key in form) {
        data.append(key, form[key]);
      }

     await axios.post("http://localhost:5000/api/delivery/auth/register", data);
      alert("Registered Successfully 🚚");

    } catch (err) {
      alert("Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm({
        ...form,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      });
      alert("Location captured 📍");
    });
  };

  return (
    <div className="register-page">

      <div className="register-header">
        <h1>🚚 Delivery Partner Registration</h1>
        <p>Fill in your details to get started</p>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>

        <input name="name" placeholder="Full Name" required onChange={handleChange} />
        <input name="email" placeholder="Email Address" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" required onChange={handleChange} />

        <input name="address" placeholder="Full Address" required onChange={handleChange} />
        <input name="city" placeholder="City" required onChange={handleChange} />

        <button type="button" onClick={getLocation}>
          📍 Use Current Location
        </button>

        <input name="licenseNumber" placeholder="Driving License Number" required onChange={handleChange} />

        <label>Upload Driving License</label>
        <input type="file" name="licenseImage" required onChange={handleChange} />

        <label>Upload Profile Photo</label>
        <input type="file" name="photo" required onChange={handleChange} />

        <button type="submit">
          {loading ? "Registering..." : "Register Now"}
        </button>

      </form>

      <div className="login-link">
        Already have an account? <a href="/login">Login</a>
      </div>

    </div>
  );
}

export default Register;