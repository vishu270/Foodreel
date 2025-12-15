import React, { useEffect, useState } from "react";
import axios from "axios";
import { api, API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../component/BottomNav";
import "./profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [savedFoods, setSavedFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [fullname, setFullname] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000'}/user/me`, { withCredentials: true });

        setUser(userRes.data.user);
        setFullname(userRes.data.user.fullname);

        const savedRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/food/saved`, { withCredentials: true });

        setSavedFoods(savedRes.data.savedItems || []);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // ================= LOGOUT =================
  async function handleLogout() {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000'}/user/logout`, {
        withCredentials: true,
      });
      navigate("/");
    } catch (err) {
      alert("Logout failed");
    }
  }

  // ================= UPDATE PROFILE =================
  async function handleUpdateProfile() {
    try {
      const formData = new FormData();
      formData.append("fullname", fullname);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000'}/user/me`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUser(res.data.user);
      setEditing(false);
    } catch (err) {
      alert("Profile update failed");
    }
  }

  if (loading) return <p className="center-text">Loading...</p>;
  if (!user) return <p className="center-text">Please login</p>;

  return (
    <>
      <div className="profile-page">
        {/* ===== HEADER ===== */}
        <div
          className="profile-card"
          style={{ height: "180px", position: "relative" }}
        >
          {/* 3 DOT MENU */}
          <div className="menu-wrapper">
            <button
              className="menu-btn"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="menu-dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>

          <img
            className="profile-avatar"
            src={user.profileImage ? `${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000'}${user.profileImage}` : "https://i.pravatar.cc/150"}
            alt="avatar"
          />

          <div className="profile-info" style={{marginLeft:'10px'}}>
            <h2 className="profile-name">{user.fullname}</h2>
            <p className="profile-email">{user.email}</p>
          <div className="edit" style={{marginTop:'15px'}}>  <button style={{height:'25px',width:'90px', borderRadius:'20px'}} className="edit-btn" onClick={() => setEditing(true)}>
              Edit Profile
            </button></div>
          </div>
        </div>

        {/* ===== STATS ===== */}
        <div className="profile-stats">
          <div className="stat-box">
            <h3>{savedFoods.length}</h3>
            <span>Saved Items</span>
          </div>
          <div className="stat-box">
            <h3>
              ₹
              {savedFoods.reduce(
                (sum, item) => sum + (item.food?.price || 0),
                0
              )}
            </h3>
            <span>Value Saved</span>
          </div>
        </div>

        {/* ===== SAVED VIDEOS ===== */}
        <div className="profile-gallery">
          {savedFoods.length > 0 ? (
            savedFoods.map((item) => (
              <div key={item._id} className="gallery-card">
                <video
                  src={item.food.videoUrl}
                  muted
                  controls
                  preload="metadata"
                  className="profile-video"
                />
              </div>
            ))
          ) : (
            <p className="center-text">No saved food yet</p>
          )}
        </div>
      </div>

      {/* ===== EDIT MODAL ===== */}
      
      {editing && (
        <div className="edit-modal">
          <div className="edit-card">
            <h3>Edit Profile</h3>

            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Full name"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />

            <div className="edit-actions">
              <button onClick={handleUpdateProfile}>Save</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      <BottomNav />
    </>
  );
};

export default Profile;
