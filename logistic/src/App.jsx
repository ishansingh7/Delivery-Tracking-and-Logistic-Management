import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Compomnets/Login/Register";
import Login from "./Compomnets/Login/Login";
import Home from "./Compomnets/HomeProfile/Home";
import Dashboard from "./Compomnets/HomeProfile/Dashboard";
import OderSeclection from "./Compomnets/TakeOders/OderSeclection";
import DomesticOder from "./Compomnets/TakeOders/Dispalyoder/DomesticOder";
import DisplayDomesticOrders from "./Compomnets/TakeOders/Dispalyoder/DisplayDomesticOrders";
import DisplayInternationalOrders from "./Compomnets/TakeOders/Dispalyoder/DisplayInternationalOrders";
import DisplayOrders from "./Compomnets/TakeOders/Dispalyoder/DisplayOders";
import AcceptOrders from "./Compomnets/TakeOders/Dispalyoder/AcceptOrders";
import OrderHistory from "./Compomnets/TakeOders/Dispalyoder/OrderHistory";
import Layout from "./Compomnets/Layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/selectdelivery" element={<Layout><DomesticOder /></Layout>} />
        <Route path="/orders/domestic" element={<Layout><DisplayDomesticOrders /></Layout>} />
        <Route path="/orders/international" element={<Layout><DisplayInternationalOrders /></Layout>} />
        <Route path="/displayorders" element={<Layout><DisplayOrders /></Layout>} />
        <Route path="/accept-orders" element={<Layout><AcceptOrders /></Layout>} />
        <Route path="/order-history" element={<Layout><OrderHistory /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;