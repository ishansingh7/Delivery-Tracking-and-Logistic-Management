// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./Compoments/LoginFrom/Login";
import DomesticDelivery from "./Compoments/DomesticDelivery/DomesticDelivery";
import AdminHome from "./Compoments/Home/AdminHome";           // your dashboard page
import AdminLayout from "./Compoments/Layout/AdminLayout";             // ← layout
import TrackDelivery from "./Compoments/Tracking/TrackDelivery";   // ← track page
import InternationlDelivery from "./Compoments/InternationalDelivery/InternationalDelivery";
import DeliveryAgents from "./Compoments/DeliveryAgents/DeliveryAgents";   // ← delivery agents

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        {/* Public: Login */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/home" replace /> : <Login onLoginSuccess={login} />
          }
        />

        {/* All protected pages use the same layout with sidebar */}
        <Route element={<AdminLayout />}>
          <Route path="/home" element={<AdminHome />} />
          <Route path="/domesticdelivery" element={<DomesticDelivery />} />
          <Route path="/trackdelivery" element={<TrackDelivery />} />
          <Route path="/internationaldelivery" element={<InternationlDelivery />} />
          <Route path="/agents" element={<DeliveryAgents />} />

          {/* Add more protected routes here later */}
          {/* <Route path="/reports" element={<Reports />} /> */}
          {/* <Route path="/settings" element={<Settings />} /> */}
        </Route>

        {/* Catch-all → redirect to login if not logged in */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;