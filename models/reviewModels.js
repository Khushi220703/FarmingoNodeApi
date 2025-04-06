const mongoose = require("mongoose");


const reviewSchema = await mongoose.Schema({

    userName:{type:String, required:true},
    review:{type:String, required:true},
    userId:{type:String, required:true},
    rating:{type:Number, required:true},
});

const Review = await mongoose.model("Review", reviewSchema);

module.exports = Review;