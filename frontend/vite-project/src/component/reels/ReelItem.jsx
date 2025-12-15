import React, { useState } from "react";
import "./reels.css";
import { Link } from "react-router-dom";
import { FaHeart, FaBookmark, FaCommentDots } from "react-icons/fa";
import axios from "axios";
// use direct backend env

function ReelItem({ reel, videoRef }) {
  // ✅ SAFE INITIAL STATE
  const [likes, setLikes] = useState(Number(reel.likesCount) || 0);
  const [liked, setLiked] = useState(!!reel.isLikedByMe);
  const [saved, setSaved] = useState(!!reel.isSavedByMe);

  // ❤️ LIKE / UNLIKE (SOURCE OF TRUTH = BACKEND)
  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/food/like`,
        { foodItemId: reel._id },
        { withCredentials: true }
      );

      // ✅ ALWAYS TRUST BACKEND
      setLiked(res.data.liked);
      setLikes(res.data.likesCount);
    } catch (err) {
      alert("Login as USER to like food");
    }
  };

  // 🔖 SAVE / UNSAVE (TOGGLE ONLY)
  const handleSave = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/food/save`,
        { foodItemId: reel._id },
        { withCredentials: true }
      );

      setSaved((prev) => !prev);
    } catch (err) {
      alert("Login as USER to save food");
    }
  };

  return (
    <div className="reel">
      <video
        ref={videoRef}
        src={reel.videoUrl}
        muted
        loop
        playsInline
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />

      {/* RIGHT ACTION BAR */}
      <div className="reel-actions">
        <button className="action-btn" onClick={handleLike}>
          <FaHeart color={liked ? "red" : "white"} />
          <span>{likes}</span>
        </button>

        <button className="action-btn" onClick={handleSave}>
          <FaBookmark color={saved ? "gold" : "white"} />
        </button>

        <button className="action-btn">
          <FaCommentDots />
          <span>0</span>
        </button>
      </div>

      {/* BOTTOM OVERLAY */}
      <div className="reel-overlay">
        <p className="reel-description">{reel.description}</p>

        <Link
          to={`/foodpartner/${reel.createdBy?._id || reel.createdBy}`}
          className="visit-btn"
        >
          Visit Store
        </Link>
      </div>
    </div>
  );
}

export default ReelItem;

