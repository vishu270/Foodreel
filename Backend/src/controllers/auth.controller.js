const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const foodPartnerModel = require('../models/foodpartner.model');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}

// COOKIE OPTIONS
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // localhost only
  sameSite: 'lax',
  path: '/',
};

// ===================== REGISTER USER =====================
async function registerUser(req, res) {
  try {
    // accept common name variants (fullName, fullname, name)
    const fullname = (req.body.fullname || req.body.fullName || req.body.full_name || req.body.name || '').toString().trim();
    const email = (req.body.email || req.body.Email || '').toString().trim();
    const password = (req.body.password || '').toString();

    console.debug('registerUser body keys:', Object.keys(req.body || {}));

    const missing = [];
    if (!fullname) missing.push('fullname/name');
    if (!email) missing.push('email');
    if (!password) missing.push('password');
    if (missing.length) {
      console.warn('registerUser missing fields:', missing, 'body keys:', Object.keys(req.body || {}));
      return res.status(400).json({
        message: 'Missing required fields',
        missing,
        received: req.body,
        contentType: req.headers['content-type'] || null,
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullname,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("registerUser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ===================== LOGIN USER =====================
async function loginUser(req, res) {
  try {
    const email = (req.body.email || req.body.Email || '').toString().trim();
    const password = (req.body.password || '').toString();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("loginUser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ===================== LOGOUT USER =====================
function logoutUser(req, res) {
  res.clearCookie("token", { path: "/" });
  return res.status(200).json({ message: "Logout successful" });
}

// ===================== REGISTER FOOD PARTNER =====================
async function registerFoodPartner(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email and password are required",
      });
    }

    const existingPartner = await foodPartnerModel.findOne({ email });
    if (existingPartner) {
      return res.status(400).json({ message: "Account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: foodPartner._id }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(201).json({
      message: "Food Partner registered successfully",
      token,
      foodPartner: {
        id: foodPartner._id,
        name: foodPartner.name,
        email: foodPartner.email,
      },
    });
  } catch (error) {
    console.error("registerFoodPartner error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ===================== LOGIN FOOD PARTNER =====================
async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const foodPartner = await foodPartnerModel.findOne({ email });
    if (!foodPartner) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, foodPartner.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: foodPartner._id, email: foodPartner.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Login successful",
      token,
      foodPartner: {
        id: foodPartner._id,
        name: foodPartner.name,
        email: foodPartner.email,
      },
    });
  } catch (error) {
    console.error("loginFoodPartner error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ===================== LOGOUT FOOD PARTNER =====================
function logoutFoodPartner(req, res) {
  res.clearCookie("token", { path: "/" });
  return res.status(200).json({ message: "Logout successful" });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};
