import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Compoments/Nevbar/Nevbar";
import Home from "./Compoments/Home/Home";
import About from "./Compoments/Pages/About/About";
import Services from "./Compoments/Pages/Services/Service";
import Contact from "./Compoments/Pages/Contact/Contact";
import ServicesDelibery from "./Compoments/ServicesDelivery/Delivery/Servicesdelivery";
import Footer from "./Compoments/Footer/Footer";
import DomesticDelivery from"./Compoments/ServicesDelivery/Delivery/StartServices/Domestic";
import InternationalDelivery from "./Compoments/ServicesDelivery/Delivery/StartServices/International";
import TrackShipment from "./Compoments/Tracking/ShipmentsTracking";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/servicesDelibery" element={<ServicesDelibery />} />
        <Route path="/domesticDelivery" element={<DomesticDelivery />} />
        <Route path="/internationalDelivery" element={<InternationalDelivery />} />
        <Route path="/track/:trackingId" element={<TrackShipment />} />
         
         

      </Routes>
      <Footer />

    </Router>
  );
}

export default App;