// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ selectedApi, setSelectedApi }) => {
  return (
    <div className="bg-light p-3 rounded shadow">
      <h2 className="text-lg font-bold mb-4">APIs</h2>
      <ul className="list-group">
        <li className="list-group-item">
          <Link
            to="/data-viz/online-vs-offline" // Use absolute path
            className={`block w-full text-left py-2 px-3 mb-2 rounded ${
              selectedApi === "online-vs-offline" ? "bg-light" : ""
            }`}
            onClick={() => setSelectedApi("online-vs-offline")}
          >
            Online vs Offline
          </Link>
        </li>
        <li className="list-group-item">
          <Link
            to="/data-viz/online-vs-offline/summary" // Use absolute path
            className={`block w-full text-left py-2 px-3 mb-2 rounded ${
              selectedApi === "online-vs-offline-summary" ? "bg-light" : ""
            }`}
            onClick={() => setSelectedApi("online-vs-offline-summary")}
          >
            Online vs Offline Summary
          </Link>
        </li>
        <li className="list-group-item">
          <Link
            to="/data-viz/total-hired-trend" // Use absolute path
            className={`block w-full text-left py-2 px-3 mb-2 rounded ${
              selectedApi === "total-hired-trend" ? "bg-light" : ""
            }`}
            onClick={() => setSelectedApi("total-hired-trend")}
          >
            Total Hired Trend
          </Link>
        </li>
        <li className="list-group-item">
          <Link
            to="/data-viz/correlation/online-rounds-hires" // Link to the correlation chart
            className={`block w-full text-left py-2 px-3 mb-2 rounded ${
              selectedApi === "online-rounds-hires" ? "bg-light" : ""
            }`}
            onClick={() => setSelectedApi("online-rounds-hires")}
          >
            Correlation: Online Rounds vs Hires
          </Link>
        </li>
        <li className="list-group-item">
          <Link
            to="/data-viz/round-type-breakdown" // Link to the round type breakdown
            className={`block w-full text-left py-2 px-3 mb-2 rounded ${
              selectedApi === "round-type-breakdown" ? "bg-light" : ""
            }`}
            onClick={() => setSelectedApi("round-type-breakdown")}
          >
            Round Type Breakdown
          </Link>
        </li>
        <li className="list-group-item">
          <Link
            to="/data-viz/gender-success-rate" // Link to the gender success rate
            className={`block w-full text-left py-2 px-3 mb-2 rounded ${
              selectedApi === "gender-success-rate" ? "bg-light" : ""
            }`}
            onClick={() => setSelectedApi("gender-success-rate")}
          >
            Gender Success Rate
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;