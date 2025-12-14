const express = require("express");
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ================= UPLOAD CONFIG =================
const uploadDir = path.resolve(__dirname, "..", "..", "uploads", "videos");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// ================= ROUTES =================

// CREATE FOOD (food partner only)
router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood
);

// GET ALL FOOD (user – reels/home)
router.get(
  "/",
  authMiddleware.authUserMiddleware,
  foodController.getAllFoodItems
);

// ✅ PUBLIC PARTNER PROFILE (NO AUTH)
router.get(
  "/partner/:partnerId",
  foodController.getFoodByPartner
);

// LIKE FOOD (user)
router.post(
  "/like",
  authMiddleware.authUserMiddleware,
  foodController.likeFoodItem
);

// SAVE FOOD (user)
router.post(
  "/save",
  authMiddleware.authUserMiddleware,
  foodController.saveFoodItem
);

// GET SAVED FOOD (user)
router.get(
  "/saved",
  authMiddleware.authUserMiddleware,
  foodController.getSavedFoodItems
);

module.exports = router;
