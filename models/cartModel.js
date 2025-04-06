const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductDetails",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    isRent: {
        type: Boolean,
        required: true
    },
    rentalDuration: {
        type: Number, 
        required: function () { return this.isRent; }, 
        min: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const FarmingoCart = mongoose.model("FarmingoCart", cartSchema);

module.exports = FarmingoCart;
