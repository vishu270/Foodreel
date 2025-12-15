import React, { useState } from "react";
import "./CreateFoodPartner.css";
import axios from "axios";
// use import.meta.env.VITE_BACKEND_URL
import { useNavigate } from "react-router-dom";

const CreateFoodPartner = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    video: null,
  });

  function handleChange(e) {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  }

  // ✅ FIXED SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault(); // 🔥 VERY IMPORTANT

    if (!formData.video) {
      alert("Please upload a video");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("video", formData.video);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/food`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Food created:", response.data);

      // ✅ NAVIGATE ONLY AFTER SUCCESS
      navigate("/");

    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      alert("Failed to upload food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-food-page">
      <h2 className="page-title">Create Food</h2>

      <form className="food-form" onSubmit={handleSubmit}>
        {/* VIDEO UPLOAD */}
        <div className="form-group">
          <label>Food Video</label>

          <label className="video-upload-box">
            <p className="upload-text">
              {formData.video
                ? formData.video.name
                : "Tap to upload food video"}
            </p>
            <span className="upload-subtext">MP4 / MOV</span>

            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleChange}
              hidden
            />
          </label>
        </div>

        {/* NAME */}
        <div className="form-group">
          <label>Food Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* PRICE */}
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Uploading..." : "Create Food"}
        </button>
      </form>
    </div>
  );
};

export default CreateFoodPartner;
