const { time } = require('console');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   fullname: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        // required: true,
    },
    profileImage: {
      type: String, // store image path
      default: "",
    },
}, 
    {
    timestamp: true,
    }
);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;