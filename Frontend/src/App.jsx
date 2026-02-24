import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Compoments/Nevbar/Nevbar";
import Home from "./Compoments/Home/Home";
import About from "./Compoments/Pages/About";
import Footer from "./Compoments/Footer/Footer";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />

    </Router>
  );
}

export default App;