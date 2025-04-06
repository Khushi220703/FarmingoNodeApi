const Logger = require("nodemon/lib/utils/log");
const FarmingoCart = require("../models/cartModel");
const ProductDetails = require("../models/buyAndRentModel");
// Add item to cart
exports.addToCart = async (req, res) => {

   
    
    try {
        const { userId, productId, quantity, isRent, rentalDuration } = req.body;

        // Check if item already exists in the cart
        let cartItem = await FarmingoCart.findOne({ userId, productId });
       
        
        if (cartItem) {
            // If item exists, update quantity
            cartItem.quantity += quantity;
        } else {
            // If item doesn't exist, create a new cart item
            cartItem = new FarmingoCart({ userId, productId, quantity, isRent, rentalDuration });
            
            
        }

        await cartItem.save();
        res.status(201).json({ message: "Item added to cart", cartItem });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: error.message });
    }
};

// Update cart item quantity
exports.updateCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { change } = req.body; // `change` can be +1 or -1

        // Find the cart item
        const cartItem = await FarmingoCart.findById(id);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        // Calculate new quantity
        const newQuantity = cartItem.quantity + change;

        if (newQuantity <= 0) {
            // Remove item if quantity reaches 0
            await FarmingoCart.findByIdAndDelete(id);
            return res.json({ message: "Item removed from cart", removed: true });
        }

        // Otherwise, update the quantity
        cartItem.quantity = newQuantity;
        await cartItem.save();

        res.json({ message: "Cart updated", cartItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRentalDuration = async (req, res) => {
    try {
        const { id } = req.params;
        const { change } = req.body; // `change` can be +1 or -1

        // Find the cart item
        const cartItem = await FarmingoCart.findById(id);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        // Calculate new rental durationcc
        const newDuration = (cartItem.rentalDuration || 1) + change;

        if (newDuration <= 0) {
            // Remove item if rental duration reaches 0
            await FarmingoCart.findByIdAndDelete(id);
            return res.json({ message: "Item removed from cart due to zero rental duration", removed: true });
        }

        // Otherwise, update the rental duration
        cartItem.rentalDuration = newDuration;
        await cartItem.save();

        res.json({ message: "Rental duration updated", cartItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get cart items for a specific user
exports.getUserCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 3 } = req.query;
        const skip = (page - 1) * limit;

        // Fetch all items for total price calculation
        const allCartItems = await FarmingoCart.find({ userId }).populate({ 
            path: "productId", 
            model: "ProductDetails" 
        });

        // Calculate total price including rental duration
        const totalPrice = allCartItems.reduce((total, item) => {
            if (item.isRent) {
                return total + (item.quantity * item.productId.rentalPrice * item.rentalDuration);
            } else {
                return total + (item.quantity * item.productId.price);
            }
        }, 0);
        console.log(totalPrice);
        
        // Fetch paginated items
        const paginatedItems = await FarmingoCart.find({ userId })
            .populate({ path: "productId", model: "ProductDetails" })
            .skip(skip)
            .limit(limit);

        const totalItems = await FarmingoCart.countDocuments({ userId });
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            items: paginatedItems,
            totalPages,
            totalPrice, // Send total price separately
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart items", error });
    }
};


// Delete a specific cart item
exports.deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;

        const cartItem = await FarmingoCart.findByIdAndDelete(id);

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.clearCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        await FarmingoCart.deleteMany({ userId });
        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to clear cart" });
    }
};


