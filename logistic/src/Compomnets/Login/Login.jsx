import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./css/Login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // ✅ navigation hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/delivery/auth/login",
        form
      );

      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token || "");

      alert(res.data.message);
      console.log(res.data.user);

      // ✅ redirect to home page
      navigate("/home");

    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">

      {/* LEFT SIDE */}
      <div className="login-left">
        <h1>🚚 Fast Delivery</h1>
        <p>Deliver packages quickly and safely with our trusted system.</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-card">
          <h2>Login</h2>
          <p className="subtitle">Welcome back, delivery partner!</p>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              <span
                className="toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Button */}
            <button type="submit">Login</button>

          </form>

          {/* Register Link */}
          <div className="register-link">
            Don’t have an account? <Link to="/register">Register</Link>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;