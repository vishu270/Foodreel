import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ReelItem from "../../component/reels/ReelItem";
import "../../component/reels/reels.css";
import axios from "axios";
// use import.meta.env.VITE_BACKEND_URL directly

function Reels() {
  const videoRefs = useRef([]);
  const observerRef = useRef(null);
  const [reelsData, setReelsData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    async function fetchReels() {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/food`, { withCredentials: true });
      setReelsData(res.data.foodItems || []);
    }
    fetchReels();
  }, []);

  useEffect(() => {
    if (!reelsData.length) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      },
      { threshold: 0.7 }
    );

    videoRefs.current.forEach(
      (video) => video && observerRef.current.observe(video)
    );

    return () => observerRef.current?.disconnect();
  }, [reelsData]);

  useEffect(() => {
    if (!location.state?.startFrom) return;

    const index = reelsData.findIndex(
      (r) => r._id === location.state.startFrom
    );

    if (index !== -1 && videoRefs.current[index]) {
      videoRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setTimeout(() => {
        videoRefs.current[index]?.play().catch(() => {});
      }, 400);
    }
  }, [location.state, reelsData]);

  return (
    <div className="reels-container">
      {reelsData.map((reel, index) => (
        <ReelItem
          key={reel._id}
          reel={reel}
          videoRef={(el) => (videoRefs.current[index] = el)}
        />
      ))}
    </div>
  );
}

export default Reels;
