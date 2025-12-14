import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./profile.css";

function Profile() {
  const { id } = useParams();
  const [foodItems, setFoodItems] = useState([]);
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/food/partner/${id}`,
          { withCredentials: true }
        );

        const items = res.data.foodItems || [];
        setFoodItems(items);

        if (items.length > 0) {
          setPartner({
            name: items[0].createdBy.name,
            email: items[0].createdBy.email,
            totalMeals: items.length,
            customers: items.length * 10,
          });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [id]);

  if (loading) return <p className="center-text">Loading...</p>;
  if (!partner) return <p className="center-text">No profile found</p>;

  return (
    <div className="profile-page">
      {/* HEADER */}
      <div className="profile-header">
        <img
          className="profile-avatar"
          src="https://i.pravatar.cc/150"
          alt="profile"
        />
        <div className="profile-info">
          <h2>{partner.name}</h2>
          <p>{partner.email}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="profile-stats">
        <div className="stat-box">
          <strong>{partner.totalMeals}</strong>
          <span>Total Meals</span>
        </div>
        <div className="stat-box">
          <strong>{partner.customers}</strong>
          <span>Customers Served</span>
        </div>
      </div>

      {/* VIDEOS */}
      <div className="profile-video-grid">
        {foodItems.map((item) => (
          <video
            key={item._id}
            src={item.videoUrl}
            muted
            loop
            controls
            className="profile-video"
          />
        ))}
      </div>
    </div>
  );
}

export default Profile;
