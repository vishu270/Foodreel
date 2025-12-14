const express = require("express");

const foodPartnerController = require("../controllers/foodpartner.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

    // GET /api/food?partner=partnerId  [protected: allow logged-in users to fetch food items by partner]
router.get("/:id", 
    authMiddleware.authUserMiddleware,
    foodPartnerController.getFoodPartnerById);


module.exports = router;