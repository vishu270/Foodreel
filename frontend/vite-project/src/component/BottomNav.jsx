import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaHeart, FaUser } from "react-icons/fa";
import "./bottomNav.css";
import { BsCameraReelsFill } from "react-icons/bs";


const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      <Link to="/" className={pathname === "/" ? "active" : ""}>
        <FaHome />
        <span>Home</span>
      </Link>
    
      <Link to="/reels" className={pathname === "/reels" ? "active" : ""}>
        <BsCameraReelsFill />
        <span>Reels</span>
      </Link>


      <Link to="/saved" className={pathname === "/saved" ? "active" : ""}>
        <FaHeart />
        <span>Saved</span>
      </Link>

      <Link to="/profile" className={pathname === "/profile" ? "active" : ""}>
        <FaUser />
        <span>Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
