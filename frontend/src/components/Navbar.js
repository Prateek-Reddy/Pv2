import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Branding */}
        <Link className="navbar-brand text-success fw-bold" to="/">
          Placement Assistant
        </Link>

        {/* Toggler for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-success" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-success" to="/pyqs">
                PYQs
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-success" to="/data-viz">
                Data Viz
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-success" to="/cur-analysis">
                CUR Analysis
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-success" to="/about-us">
                About Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
