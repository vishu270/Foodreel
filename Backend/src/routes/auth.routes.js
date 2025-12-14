const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const userModel = require("../models/user.model");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: "uploads/profile",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ================= USER ROUTES =================
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);

// ✅ GET USER PROFILE
router.get(
  "/user/me",
  authMiddleware.authUserMiddleware,
  (req, res) => {
    res.status(200).json({
      user: {
        id: req.user._id,
        fullname: req.user.fullname,
        email: req.user.email,
        profileImage: req.user.profileImage,
      },
    });
  }
);

// ✅ UPDATE USER PROFILE (NEW)
router.put(
  "/user/me",
  authMiddleware.authUserMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const updateData = {};

      if (req.body.fullname) {
        updateData.fullname = req.body.fullname;
      }

      if (req.file) {
        updateData.profileImage = `/uploads/profile/${req.file.filename}`;
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true }
      );

      res.status(200).json({
        user: {
          id: updatedUser._id,
          fullname: updatedUser.fullname,
          email: updatedUser.email,
          profileImage: updatedUser.profileImage,
        },
      });
    } catch (err) {
      console.error("Update profile error:", err);
      res.status(500).json({ message: "Profile update failed" });
    }
  }
);


// ================= FOOD PARTNER ROUTES =================
router.post("/foodpartner/register", authController.registerFoodPartner);
router.post("/foodpartner/login", authController.loginFoodPartner);
router.get("/foodpartner/logout", authController.logoutFoodPartner);

module.exports = router;
