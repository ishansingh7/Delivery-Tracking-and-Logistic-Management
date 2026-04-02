import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Compomnets/Login/Register";
import Login from "./Compomnets/Login/Login";
import Home from "./Compomnets/HomeProfile/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;