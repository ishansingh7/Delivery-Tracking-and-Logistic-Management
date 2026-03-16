// src/layouts/AdminLayout.jsx
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Home.css';   // we'll create this next

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const companyName = "SwiftLogix"; // ← your company
  const userName = "Ishan Singh";
  const userRole = "Admin";

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    if (window.confirm('Logout from Admin Portal?')) {
      // In real app → also clear tokens/context here
      window.location.href = '/';
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar - always visible on protected pages */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🚚</span>
            <span className="logo-text">{companyName}</span>
          </div>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? '«' : '»'}
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
              <Link to="/home" className={window.location.pathname === '/home' ? 'active' : ''}>
                <span className="icon">🏠</span>
                <span className="label">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/domesticdelivery" className={window.location.pathname === '/domesticdelivery' ? 'active' : ''}>
                <span className="icon">📦</span>
                <span className="label">Domestic Delivery</span>
              </Link>
            </li>
             <li>
              <Link to="/internationaldelivery" className={window.location.pathname === '/internationaldelivery' ? 'active' : ''}>
                <span className="icon">📦</span>
                <span className="label">International Delivery</span>
              </Link>
            </li>

           <li className="highlight-item">
        <Link to="/trackdelivery" className={window.location.pathname === '/trackdelivery' ? 'active' : ''}>
            <span className="icon">🔍</span>
            <span className="label">Track Parcel</span>
                     </Link>
             </li>

            <li>
              <Link to="/reports">
                <span className="icon">📊</span>
                <span className="label">Reports</span>
              </Link>
            </li>
            <li>
              <Link to="/settings">
                <span className="icon">⚙️</span>
                <span className="label">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="icon">🚪</span>
            <span className="label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Changing content goes here */}
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Outlet />  {/* ← this is where nested routes render */}
      </main>
    </div>
  );
}