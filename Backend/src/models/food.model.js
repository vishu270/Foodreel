const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },  
    video: {
        type: String,
    },
    videoUrl: {
        type: String,  // ImageKit hosted URL
        required: true,
    },
    videoFileId: {
        type: String,  // ImageKit file ID for deletion
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner",
        required: true,
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner",
    },
    likesCount: {
        type: Number,
        default: 0,

    }
})

// add timestamps
foodSchema.set('timestamps', true);

const foodModel = mongoose.model("food", foodSchema);

module.exports = foodModel;