const FarmingoCart = require('../models/cartModel');
const FarmingoBuy = require('../models/buyProductModel');

exports.buyItems = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId);

        
        const cartItems = await FarmingoCart.find({ userId }).populate('productId');

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        console.log(cartItems);
        
       
        const purchases = await Promise.all(cartItems.map(async (item) => {
            const totalPrice = item.isRent
                ? item.rentalDuration * item.productId.rentalPrice
                : item.quantity * item.productId.price;

            const newPurchase = new FarmingoBuy({
                userId,
                sellerId: item.productId.postedBy,
                productId: item.productId._id,
                quantity: item.quantity,
                rentalDuration: item.rentalDuration,
                isRent: item.isRent,
                totalPrice
            });

            return newPurchase.save();
        }));

       
        await FarmingoCart.deleteMany({ userId });

        res.json({ message: "Purchase successful", purchases });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
