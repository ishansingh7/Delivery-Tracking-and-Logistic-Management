// src/layouts/AdminLayout.jsx
import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Open by default
  const location = useLocation();

  const companyName = "SwiftLogix";
  const userName = "Admin User";
  const userRole = "Administrator";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Logout from Admin Portal?')) {
      window.location.href = '/';
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🚚</span>
            <span className="logo-text">{companyName}</span>
          </div>
          <button className="toggle-btn" onClick={toggleSidebar} title="Toggle Sidebar">
            {isSidebarOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className="user-profile">
          <div className="avatar">{userName.charAt(0)}</div>
          <div className="user-info">
            <h4>{userName}</h4>
            <p>{userRole}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link 
                to="/home" 
                className={location.pathname === '/home' ? 'active' : ''}
              >
                <span className="icon">🏠</span>
                <span className="label">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/domesticdelivery" 
                className={location.pathname === '/domesticdelivery' ? 'active' : ''}
              >
                <span className="icon">📦</span>
                <span className="label">Domestic Delivery</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/internationaldelivery" 
                className={location.pathname === '/internationaldelivery' ? 'active' : ''}
              >
                <span className="icon">🌍</span>
                <span className="label">International Delivery</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/trackdelivery" 
                className={location.pathname === '/trackdelivery' ? 'active' : ''}
              >
                <span className="icon">🔍</span>
                <span className="label">Track Parcel</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/agents" 
                className={location.pathname === '/agents' ? 'active' : ''}
              >
                <span className="icon">👥</span>
                <span className="label">Delivery Agents</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/reports"
                className={location.pathname === '/reports' ? 'active' : ''}
              >
                <span className="icon">📊</span>
                <span className="label">Reports</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/settings"
                className={location.pathname === '/settings' ? 'active' : ''}
              >
                <span className="icon">⚙️</span>
                <span className="label">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <span className="icon">🚪</span>
            <span className="label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar with Toggle Button */}
        <div className="top-bar">
          <button className="mobile-toggle" onClick={toggleSidebar} title="Toggle Sidebar">
            ☰
          </button>
          <h1 className="page-title">Admin Dashboard</h1>
          <div className="spacer"></div>
        </div>
        
        {/* Page Content */}
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}