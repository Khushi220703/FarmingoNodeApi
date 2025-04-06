const mongoose = require("mongoose");

const productDetailsSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isForRent: {
    type: Boolean,
    default: false,
  },
  rentalPrice: {
    type: Number,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  location: {
    type: String,
  },
  contactDetails: {
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  images: [
    {
      type: String,
      required: true, // URL of images
    },
  ],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  metaData: {
    type: mongoose.Schema.Types.Mixed, 
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  
  likes: { type: Number, default: 0 },
  likedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] }
});

const Product = mongoose.model("ProductDetails", productDetailsSchema);

module.exports = Product;
