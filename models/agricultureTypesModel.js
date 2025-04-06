const mongoose = require("mongoose");

const CropProductionSchema = new mongoose.Schema({
  field: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mainCrops: {
    type: [String], // Array of strings
    required: true
  },
  methods: {
    type: [String], // Array of farming methods
    required: true
  },
  importance: {
    type: String,
    required: true
  },
  challenges: {
    type: [String], // Array of challenges
    required: true
  },
  image: {
    type: String, // URL to an image
    required: true
  }
});

const CropProduction = mongoose.model("CropProduction", CropProductionSchema);

module.exports = CropProduction;
