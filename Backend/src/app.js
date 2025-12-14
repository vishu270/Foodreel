// create server and setup middleware
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const  foodpartnerRoutes = require('./routes/foodpartner.routes');
const cors =require('cors');

// enable CORS for all routes

// parse JSON and URL-encoded bodies (handles form posts and JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));

// serve uploaded files
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));


// mount auth routes
const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

// mount food routes
const foodRoutes = require('./routes/food.routes');
app.use('/api/food', foodRoutes);

// test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = app;
