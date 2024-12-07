import React from "react";
import { Link } from "react-router-dom";
import image from "../navigation/profile.jpeg";

function TopNavBar() {
  return (
    <nav className="TopNavBar d-flex justify-content-between align-items-center text-dark py-3 px-4">
      <div className="logo fs-1 fw-bold"><i class="fa-solid fa-compass mx-3"></i>Analytics </div>

      <div className="search-container">
        <input type="text" className="search-input" placeholder="Search..." />
          <button className="search-button">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
      </div>

      <div className="TopNavbarElements d-flex align-items-center">
        <div className="CompanyName fs-4 me-3"><Link style={{textDecoration:"None", color: "Black"}} to="/register">Business Compass</Link></div>
        <div className="CompanyLogo">
          <img src={image} className="profileImage rounded-circle" alt="Company logo" style={{width: '60px'}} />
        </div>
      </div>
    </nav>
  );
}

export default TopNavBar;
