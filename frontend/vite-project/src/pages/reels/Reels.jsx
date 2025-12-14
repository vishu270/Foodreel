import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// ✅ correct imports based on your folder structure
import ReelItem from "../../component/reels/ReelItem";
import "../../component/reels/reels.css";
import BottomNav from "../../component/BottomNav";

function Reels() {
  const videoRefs = useRef([]);
  const [reelsData, setReelsData] = useState([]);
  const location = useLocation(); // 🔥 used for Saved → Reels jump

  /* =========================
     FETCH ALL FOOD REELS
  ========================= */
  useEffect(() => {
    async function fetchReels() {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/food",
          { withCredentials: true }
        );

        setReelsData(res.data.foodItems || []);
      } catch (err) {
        console.error("Fetch reels error:", err);
      }
    }

    fetchReels();
  }, []);

  /* =========================
     INTERSECTION OBSERVER
  ========================= */
  useEffect(() => {
    if (!reelsData.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!video) return;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.7 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [reelsData]);

  /* =========================
     AUTO SCROLL FROM SAVED
  ========================= */
  useEffect(() => {
    if (!location.state?.startFrom || !reelsData.length) return;

    const index = reelsData.findIndex(
      (item) => item._id === location.state.startFrom
    );

    if (index !== -1 && videoRefs.current[index]) {
      videoRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setTimeout(() => {
        videoRefs.current[index].play().catch(() => {});
      }, 300);
    }
  }, [location.state, reelsData]);

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="reels-container">
      {reelsData.map((reel, index) => (
        <ReelItem
          key={reel._id}
          reel={reel}
          videoRef={(el) => (videoRefs.current[index] = el)}
        />
      ))}
      <BottomNav />
    </div>
  );
}

export default Reels;
