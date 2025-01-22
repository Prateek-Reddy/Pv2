import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PYQs from "./pages/PYQs";
import DataViz from "./pages/DataViz";
import CURAnalysis from "./pages/CURAnalysis";
import AboutUs from "./pages/AboutUs";


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pyqs" element={<PYQs />} />
        <Route path="/data-viz/*" element={<DataViz />} />
        <Route path="/cur-analysis" element={<CURAnalysis />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
       {/* Include the Chatbot component here */}
    </Router>
  );
};

export default App;