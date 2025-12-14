import React from "react";
import { Routes, Route } from "react-router-dom";


// ===== GENERAL PAGES =====
import Home from "../pages/general/Home";
import UserProfile from "../pages/general/Profile";

// ===== AUTH PAGES =====
import UserRegister from "../pages/UserRegister";
import UserLogin from "../pages/UserLogin";
import FoodPartnerRegister from "../pages/FoodPartnerRegister";
import FoodPartnerLogin from "../pages/FoodPartnerLogin";

// ===== FOOD PARTNER =====
import CreateFoodPartner from "../pages/food-partner/CReateFoodPartner";
import FoodPartnerProfile from "../pages/food-partner/Profile";

// ===== REELS & SAVED =====
import Reels from "../pages/reels/Reels";      // ✅ REQUIRED
import Saved from "../pages/saved/Saved";

// ===== FALLBACK =====
import NotFound from "../pages/NotFound";
import GetStarted from "../pages/front/GetStarted";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ===== HOME ===== */}
      <Route path="/" element={<Home />} />
      <Route path="/get-started" element={<GetStarted />} />

      {/* ===== USER AUTH ===== */}
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/login" element={<UserLogin />} />

      {/* ===== FOOD PARTNER AUTH ===== */}
      <Route path="/foodpartner/register" element={<FoodPartnerRegister />} />
      <Route path="/foodpartner/login" element={<FoodPartnerLogin />} />

      {/* ===== FOOD PARTNER DASHBOARD ===== */}
      <Route path="/create-food" element={<CreateFoodPartner />} />
      <Route path="/foodpartner/:id" element={<FoodPartnerProfile />} />

      {/* ===== REELS FLOW ===== */}
      <Route path="/reels" element={<Reels />} />        {/* 🔥 FIXED */}
      <Route path="/saved" element={<Saved />} />

      {/* ===== USER PROFILE ===== */}
      <Route path="/profile" element={<UserProfile />} />

      {/* ===== 404 ===== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;  