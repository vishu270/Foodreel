import React, { useEffect, useState } from "react";
import "./saved.css";
import axios from "axios";
// using import.meta.env.VITE_BACKEND_URL directly
import BottomNav from "../../component/BottomNav";
import { useNavigate } from "react-router-dom";

const Saved = () => {
  const [savedItems, setSavedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSaved() {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/food/saved`, { withCredentials: true });
      setSavedItems(res.data.savedItems || []);
    }
    fetchSaved();
  }, []);

  return (
    <>
      <div className="saved-page">
        <h2 className="saved-title">Saved</h2>

        <div className="saved-grid">
          {savedItems.map((item) => (
            <div
              key={item._id}
              className="saved-card"
              onClick={() =>
                navigate("/reels", {
                  state: { startFrom: item.food._id },
                })
              }
            >
              <video
                className="saved-video"
                src={item.food.videoUrl}
                muted
                playsInline
              />

              <div className="saved-overlay">
                <p>{item.food.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </>
  );
};

export default Saved;
