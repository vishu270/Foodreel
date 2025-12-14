const foodpartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const foodModel = require("../models/food.model");
const jwt = require("jsonwebtoken");

async function authFoodPartnerMiddleware(req, res, next) {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "please login first"
        });
    }

    try {
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const foodPartner = await foodpartnerModel.findById(decoded.id);

        req.foodPartner = foodPartner;

        next();

    } catch (err) {
        console.error("authFoodPartnerMiddleware error:", err);
        return res.status(500).json({ 
            message: "Internal server error"
         });
    }
}

async function getFoodItems(req,res) {
    const foodItems = await foodModel.find({})
    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems
    });
    };
    

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "please login first"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id);
        req.user = user;
        next();
    } catch (err) {
        console.error("authUserMiddleware error:", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }   
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware,
};