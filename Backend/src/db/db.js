const mongoose = require('mongoose');

function connectDB() {
    const uri = process.env.MONGODB_URI || process.env.MONGODB || 'mongodb://127.0.0.1:27017/food-view';
    console.log('MONGODB_URI is:', uri);
    mongoose
        .connect(uri)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB', err);
        });
}

module.exports = connectDB;


