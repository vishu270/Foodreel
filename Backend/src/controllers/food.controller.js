const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const Like = require("../models/likes.model");
const Save = require("../models/save.model");

/* =========================
   CREATE FOOD
========================= */
async function createFood(req, res) {
  try {
    const { name, price, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        message: "name and price are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const fileId = uuid();

    const uploadResult = await storageService.uploadFile(
      fileBuffer,
      fileId,
      req.file.originalname
    );

    const foodItem = await foodModel.create({
      name,
      description,
      price: Number(price),
      createdBy: req.foodPartner._id, // 🔥 IMPORTANT
      foodPartner: req.foodPartner._id,
      videoUrl: uploadResult.url,
      videoFileId: uploadResult.fileId || fileId,
      video: uploadResult.fileName || req.file.originalname,
    });

    return res.status(201).json({
      message: "Food item created successfully",
      data: foodItem,
    });
  } catch (err) {
    console.error("createFood error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}


// GET FOOD BY PARTNER ID (PUBLIC PROFILE)
async function getFoodByPartner(req, res) {
  try {
    const partnerId = req.params.partnerId;

    const foodItems = await foodModel
      .find({ createdBy: partnerId })   // 🔥 FILTER
      .populate("createdBy", "name email");

    return res.status(200).json({ foodItems });
  } catch (err) {
    console.error("getFoodByPartner error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}


/* =========================
   GET ALL FOOD ITEMS (HOME / REELS)
========================= */
async function getAllFoodItems(req, res) {
  try {
    const foodItems = await foodModel
      .find()
      .populate("createdBy", "name email");

    return res.status(200).json({ foodItems });
  } catch (err) {
    console.error("getAllFoodItems error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

/* =========================
   ✅ GET MY FOOD ITEMS (PROFILE)
========================= */
async function getMyFoodItems(req, res) {
  try {
    // for food partner profile
    const ownerId = req.foodPartner?._id || req.user?.id;

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const foodItems = await foodModel.find({
      createdBy: ownerId, // 🔥 FILTER FIX
    });

    return res.status(200).json({
      foodItems,
    });
  } catch (err) {
    console.error("getMyFoodItems error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

/* =========================
   LIKE / UNLIKE FOOD  ✅ FIXED
========================= */
async function likeFoodItem(req, res) {
  try {
    const { foodItemId } = req.body;
    const userId = req.user.id;

    if (!foodItemId) {
      return res.status(400).json({ message: "foodItemId is required" });
    }

    const alreadyLiked = await Like.findOne({
      food: foodItemId,
      user: userId,
    });

    // UNLIKE
    if (alreadyLiked) {
      await Like.deleteOne({ food: foodItemId, user: userId });

      const updatedFood = await foodModel.findByIdAndUpdate(
        foodItemId,
        { $inc: { likesCount: -1 } },
        { new: true }
      );

      return res.status(200).json({
        liked: false,
        likesCount: updatedFood.likesCount,
      });
    }

    // LIKE
    await Like.create({
      food: foodItemId,
      user: userId,
    });

    const updatedFood = await foodModel.findByIdAndUpdate(
      foodItemId,
      { $inc: { likesCount: 1 } },
      { new: true }
    );

    return res.status(201).json({
      liked: true,
      likesCount: updatedFood.likesCount,
    });

  } catch (err) {
    console.error("likeFoodItem error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/* =========================
   SAVE / UNSAVE FOOD
========================= */
async function saveFoodItem(req, res) {
  try {
    const { foodItemId } = req.body;
    const userId = req.user.id;

    if (!foodItemId) {
      return res.status(400).json({
        message: "foodItemId is required",
      });
    }

    const alreadySaved = await Save.findOne({
      food: foodItemId,
      user: userId,
    });

    if (alreadySaved) {
      await Save.deleteOne({ food: foodItemId, user: userId });
      return res.status(200).json({
        message: "Food item unsaved",
      });
    }

    await Save.create({
      food: foodItemId,
      user: userId,
    });

    return res.status(201).json({
      message: "Food item saved",
    });
  } catch (err) {
    console.error("saveFoodItem error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

/* =========================
   GET SAVED FOOD ITEMS
========================= */
async function getSavedFoodItems(req, res) {
  try {
    const savedItems = await Save.find({
      user: req.user.id,
    }).populate("food");

    return res.status(200).json({
      savedItems,
    });
  } catch (err) {
    console.error("getSavedFoodItems error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = {
  createFood,
  getAllFoodItems,
  getMyFoodItems,   // ✅ ADD THIS
  likeFoodItem,
  saveFoodItem,
  getSavedFoodItems,
  getFoodByPartner, // ✅ ADD THIS
};
