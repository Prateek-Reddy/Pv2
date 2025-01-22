// DataViz.js
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Adjust the path as necessary
import OnlineVsOffline from "./OnlineVsOffline"; // Import your OnlineVsOffline component
import OnlineVsOfflineSummary from "./OnlineVsOfflineSummary"; // Import your OnlineVsOfflineSummary component
import HiredTrend from "./HiredTrend"; // Import your HiredTrend component
import OnlineRoundsHiresCorrelation from "./OnlineRoundsHiresCorrelation"; // Import your correlation component
import RoundTypeSelection from "./RoundTypeSelection"; // Import your round type selection component
import GenderSuccessRate from "./GenderSuccessRate"; // Import your new gender success rate component

const DataViz = () => {
  const [selectedApi, setSelectedApi] = useState(null);

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <Sidebar
            selectedApi={selectedApi}
            setSelectedApi={setSelectedApi}
          />
        </div>

        {/* Main Chart Area */}
        <div className="col-md-9">
          <div className="p-3 rounded shadow bg-white">
            <h2 className="text-xl font-bold mb-4">Data Visualization</h2>
            <Routes>
              <Route 
                path="online-vs-offline" 
                element={<OnlineVsOffline key="online-vs-offline" />} 
              />
              <Route 
                path="online-vs-offline/summary" 
                element={<OnlineVsOfflineSummary key="online-vs-offline-summary" />} 
              />
              <Route 
                path="total-hired-trend" 
                element={<HiredTrend key="total-hired-trend" />} 
              />
              <Route 
                path="correlation/online-rounds-hires" 
                element={<OnlineRoundsHiresCorrelation key="online-rounds-hires" />} 
              />
              <Route 
                path="round-type-breakdown" 
                element={<RoundTypeSelection key="round-type-selection" />} 
              />
              <Route 
                path="gender-success-rate" 
                element={<GenderSuccessRate key="gender-success-rate" />} 
              /> {/* Add the new route for Gender Success Rate */}
              {/* You can add more routes here for other visualizations */}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataViz;