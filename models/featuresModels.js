const mongoose = require("mongoose");

const featureSchema = await mongoose.Schema({
    featureName: {type:String, required:true},
    desc:{type:String, require:true},
    image: {type:Image, require:true},
});

const Feature = await mongoose.model("Feature", featureSchema);

module.exports = Feature;