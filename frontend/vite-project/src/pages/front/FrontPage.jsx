import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNav from "../../component/BottomNav";
import "./frontpage.css";

const heroImages = [
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9",
];

function FrontPage() {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const [reels, setReels] = useState([]);
  const [user, setUser] = useState(null);

  // 🔁 Hero image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 🔐 Check login
  useEffect(() => {
    axios
      .get("http://localhost:3000/user/me", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  // 🎥 Fetch preview reels
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food", { withCredentials: true })
      .then((res) => {
        setReels(res.data.foodItems?.slice(0, 9) || []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="front-page">
      <h1 className="logo">FoodReels 🍔🎥</h1>

      {/* ===== HERO ===== */}
      <div
        className="hero"
        style={{
          backgroundImage: `url(${heroImages[heroIndex]})`,
        }}
      />
<hr/>
      {/* ===== CTA ===== */}
      <div className="cta-wrapper" style={{marginTop:"10px"}}>
        {user ? (
          <>
            <h3>Welcome to FoodReels 👋</h3>
            <button style={{ backgroundColor:'#323fcaff'}}
              className="primary-btn"
              onClick={() => navigate("/reels")}
            >
              Watch Reels
            </button>
          </>
        ) : (
          <>
            <h3>Discover food in reels</h3>
            <button  style={{ backgroundColor:'#323fcaff'}}
              className="primary-btn"
              onClick={() => navigate("/get-started")}
            >
              Get Started
            </button>
          </>
        )}
      </div>
<hr/>
      {/* ===== PREVIEW REELS ===== */}
      <div className="preview-grid"   style={{marginTop:"15px",marginBottom:'-60px'}}>
        {reels.map((r) => (
          <video
            key={r._id}
            src={r.videoUrl}
            muted
            loop
            playsInline
            onClick={() =>
              navigate("/reels", { state: { startFrom: r._id } })
            }
          />
        ))}
      </div>
      <hr/>
{/* ===== SECOND ROW (5 to 9) ===== */}
<div className="preview-grid" style={{ marginTop: "12px" }}>
  {reels.slice(5, 9).map((r) => (
    <video
      key={r._id}
      src={r.videoUrl}
      muted
      loop
      playsInline
      onClick={() =>
        navigate("/reels", { state: { startFrom: r._id } })
      }
    />
  ))}
</div>


      <BottomNav />
    </div>
  );
}

export default FrontPage;
