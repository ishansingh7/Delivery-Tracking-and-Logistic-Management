import { useLocation, useNavigate } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="logo-section">
        <h2>🚚 DeliExpress</h2>
      </div>
      <ul>
        <li 
          className={location.pathname === "/home" ? "active" : ""}
          onClick={() => navigate("/home")}
        >
          👤 Profile
        </li>
        <li 
          className={location.pathname === "/dashboard" ? "active" : ""}
          onClick={() => navigate("/dashboard")}
        >
          📊 Dashboard
        </li>
       <li 
         className={location.pathname === "/selectdelivery" ? "active" : ""}
         onClick={() => navigate("/selectdelivery")}
       >
📦 Accept Orders
</li>
        <li 
          className={location.pathname === "/displayorders" ? "active" : ""}
          onClick={() => navigate("/displayorders")}
        >
          📋 My Orders
        </li>
        <li 
          className={location.pathname === "/order-history" ? "active" : ""}
          onClick={() => navigate("/order-history")}
        >
          📜 Order History
        </li>
        <li>💰 Earnings</li>
        <li>⚙️ Settings</li>
        <li onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;