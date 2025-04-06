const cloudinary = require("cloudinary").v2;  // Fix typo: 'cloundinary' -> 'cloudinary'
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
});

module.exports = cloudinary;