// src/Compoments/LoginFrom/Login.jsx
import { useState } from 'react';
import './LoginCss/Login.css'; // your existing css file (if any)

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded credentials (ONLY for demo / local development!)
  const DEFAULT_USERNAME = 'admin';
  const DEFAULT_PASSWORD = 'admin123';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Fake network delay
    setTimeout(() => {
      if (
        username.trim().toLowerCase() === DEFAULT_USERNAME &&
        password === DEFAULT_PASSWORD
      ) {
        // SUCCESS → tell App.jsx that login was successful
        onLoginSuccess();
        // No need for window.location – we use <Navigate> + state
      } else {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Admin / Delivery Login</h1>
        <p>Please sign in to continue</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoFocus
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="hint">
          Default: <strong>admin / admin123</strong>
        </div>
      </div>
    </div>
  );
}