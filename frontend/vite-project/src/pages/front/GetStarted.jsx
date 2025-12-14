import React from "react";
import { useNavigate } from "react-router-dom";
import "./getstarted.css";

function GetStarted() {
  const navigate = useNavigate();

  return (
    <> <h1 className="logo">FoodReels 🍔 🎥</h1>
    <div className="get-started-page">
      <h1 className="gs-title">Who are you?</h1>
      <p className="gs-subtitle">Login / Register as</p>

      <div className="gs-card-container">
        {/* USER */}
        <div
          className="gs-card"
          onClick={() => navigate("/user/login")}
        >
          <span className="gs-emoji">👤</span>
          <h3>User</h3>
          <p>Watch reels, like & save food</p>
        </div>

        {/* FOOD PARTNER */}
        <div
          className="gs-card"
          onClick={() => navigate("/foodpartner/login")}
        >
          <span className="gs-emoji">🍽️</span>
          <h3>Food Partner</h3>
          <p>Upload reels & grow business</p>
        </div>
      </div>
    </div>
    </>

  );
}

export default GetStarted;
