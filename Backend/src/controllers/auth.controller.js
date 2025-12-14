const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const foodPartnerMOdel = require('../models/foodpartner.model');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

// COOKIE OPTIONS (for localhost)
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false,   // must be false on localhost
    sameSite: 'lax',
    path: '/'
};

// REGISTER USER
async function registerUser(req, res) {
    try {
        console.log('registerUser body:', req.body);

        const { fullname, email, password } = {
            fullname: req.body.fullname || req.body.name,
            email: req.body.email,
            password: req.body.password,
        };

        const missing = [];
        if (!fullname) missing.push('fullname');
        if (!email) missing.push('email');
        if (!password) missing.push('password');

        if (missing.length) {
            return res.status(400).json({
                message: 'Missing required fields',
                missing,
                received: req.body
            });
        }

        const isUserAlreadyExists = await userModel.findOne({ email });
        if (isUserAlreadyExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            fullname,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET);

        // ⭐ FIXED COOKIE ⭐
        res.cookie('token', token, COOKIE_OPTIONS);

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email
            }
        });

    } catch (err) {
        console.error('registerUser error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// LOGIN USER
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, fullname: user.fullname },
            JWT_SECRET
        );

        // ⭐ FIXED COOKIE ⭐
        res.cookie('token', token, COOKIE_OPTIONS);

        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email
            }
        });

    } catch (err) {
        console.error('loginUser error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// LOGOUT USER
function logoutUser(req, res) {
    res.clearCookie('token', { path: '/' });
    return res.status(200).json({ message: 'Logout successful' });
}

// REGISTER FOOD PARTNER
async function registerFoodPartner(req, res) {
    try {
        console.log('registerFoodPartner body:', req.body);

        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'name, email and password are required' });
        }

        const isAccountAlreadyExists = await foodPartnerMOdel.findOne({ email });

        if (isAccountAlreadyExists) {
            return res.status(400).json({ message: 'Account already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const foodPartner = await foodPartnerMOdel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: foodPartner._id }, JWT_SECRET);

        // ⭐ FIXED COOKIE ⭐
        res.cookie('token', token, COOKIE_OPTIONS);

        return res.status(201).json({
            message: 'Food Partner registered successfully',
            foodPartner: {
                id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email
            }
        });

    } catch (err) {
        console.error('registerFoodPartner error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// LOGIN FOOD PARTNER
async function loginFoodPartner(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const foodPartner = await foodPartnerMOdel.findOne({ email });

        if (!foodPartner) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: foodPartner._id, email: foodPartner.email, name: foodPartner.name },
            JWT_SECRET
        );

        // ⭐ FIXED COOKIE ⭐
        res.cookie('token', token, COOKIE_OPTIONS);

        return res.status(200).json({
            message: 'Login successful',
            foodPartner: {
                id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email
            }
        });

    } catch (err) {
        console.error('loginFoodPartner error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// LOGOUT FOOD PARTNER
function logoutFoodPartner(req, res) {
    res.clearCookie('token', { path: '/' });
    return res.status(200).json({ message: 'Logout successful' });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};
