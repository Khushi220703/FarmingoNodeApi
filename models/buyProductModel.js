const mongoose = require('mongoose');

const BuySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Added sellerId
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductDetails', required: true },
    
    quantity: { type: Number, default: 1 },
    rentalDuration: { type: Number, default: 1 },
    isRent: { type: Boolean, default: false },
    totalPrice: { type: Number, required: true },
    isReturned: { type: Boolean, default: false }, 

    // Order Status & Dates
    orderStatus: { type: String, enum: ['Ordered', 'Shipped', 'Delivered'], default: 'Ordered' },
    orderedDate: { type: Date, default: Date.now }, 
    shippedDate: { type: Date },  
    deliveredDate: { type: Date } 
});

// Middleware to update timestamps based on orderStatus changes
BuySchema.pre('save', function (next) {
    if (this.isModified('orderStatus')) {
        if (this.orderStatus === 'Shipped' && !this.shippedDate) {
            this.shippedDate = new Date();
        }
        if (this.orderStatus === 'Delivered' && !this.deliveredDate) {
            this.deliveredDate = new Date();
        }
    }
    next();
});

const FarmingoBuy = mongoose.model('FarmingoBuy', BuySchema);
module.exports = FarmingoBuy;
