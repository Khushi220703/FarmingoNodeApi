const FarmingoBuy = require("../models/buyProductModel");
const Product = require("../models/buyAndRentModel");
const mongoose = require("mongoose");
const monthlyPurchase = async (req,res) =>{
    let { sellerId } = req.params; // Get sellerId from query params
    sellerId = sellerId.replace(":","");
   
    
    
    try {

        // const finding = await FarmingoBuy.find({ sellerId: "67ed22d9d5800eb2c7cc033c",orderStatus: "Delivered" });
        // console.log(finding);
        
        const salesData = await FarmingoBuy.aggregate([
            {
                $match: {
                    orderStatus: "Delivered",
                    sellerId: new mongoose.Types.ObjectId(sellerId) // Convert to ObjectId if needed
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$orderedDate" },
                        month: { $month: "$orderedDate" }
                    },
                    totalSales: { $sum: "$totalPrice" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        if (salesData.length === 0) {
            return res.json({ message: "No sales data found for this seller", data: [] });
        }

        res.status(200).json(salesData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const yourPurchaseOrder = async(req,res) =>{

    try {
        let { sellerId } = req.params;
        sellerId = sellerId.replace(":","");
        
        const purchasedOrders = await FarmingoBuy.find({
            sellerId: new mongoose.Types.ObjectId(sellerId),
            isRent: false,
            orderStatus: "Ordered" 
        });

        if (!purchasedOrders.length) {
            return res.status(404).json({ message: "No ordered products found for this seller" });
        }

        
        const productIds = purchasedOrders.map(order => order.productId);

        
        const products = await Product.find({ _id: { $in: productIds } });

       
        const response = purchasedOrders.map(order => {
            const product = products.find(p => p._id.toString() === order.productId.toString());
            return {
                orderId: order._id,
                orderStatus: order.orderStatus,
                orderedDate: order.orderedDate,
                totalPrice: order.totalPrice,
                quantity:order.quantity,
                product: product ? {
                    productId: product._id,
                    name: product.productName,
                    price: product.price,
                    category: product.category,
                    
                } : null
            };
        });

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const yourRentOrder = async(req,res) =>{

    try {
        let { sellerId } = req.params;
        sellerId = sellerId.replace(":","");
        const finding = await FarmingoBuy.find({ sellerId: "67ed22d9d5800eb2c7cc033c",orderStatus: "Ordered" });
        console.log(finding);
        const purchasedOrders = await FarmingoBuy.find({
            sellerId: new mongoose.Types.ObjectId(sellerId),
            isRent: true,
            orderStatus: "Ordered" 
        });

        if (!purchasedOrders.length) {
            return res.status(404).json({ message: "No ordered products found for this seller" });
        }

        
        const productIds = purchasedOrders.map(order => order.productId);

        
        const products = await Product.find({ _id: { $in: productIds } });

       
        const response = purchasedOrders.map(order => {
            const product = products.find(p => p._id.toString() === order.productId.toString());
            return {
                orderId: order._id,
                orderStatus: order.orderStatus,
                orderedDate: order.orderedDate,
                totalPrice: order.totalPrice,
                quantity:order.quantity,
                rentalDuration:order.rentalDuration,
                product: product ? {
                    productId: product._id,
                    name: product.productName,
                    price: product.price,
                    category: product.category,
                    
                    
                    
                } : null
            };
        });

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const orderShipped = async (req,res) =>{

    try {
        const { orderId } = req.params; 
        console.log(orderId);
        
       
        const updatedOrder = await FarmingoBuy.findByIdAndUpdate(
           {_id:orderId},
            { orderStatus: "Delivered" },
            { new: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

       
        
        res.status(200).json({ message: "Order marked as Delivered", order: updatedOrder });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const rentedItems = async (req, res) => {
    try {
        let { sellerId } = req.params;
        sellerId = sellerId.replace(":","");
        
        
        const rentedOrders = await FarmingoBuy.find({
            sellerId: new mongoose.Types.ObjectId(sellerId),
            isRent: true,
            isReturned: false,
            orderStatus: "Delivered"
        });


        if (!rentedOrders.length) {
            return res.status(404).json({ message: "No rented items found for this seller." });
        }

       
        const productIds = rentedOrders.map(order => order.productId);

        
        const products = await Product.find({ _id: { $in: productIds } });

        
        const response = rentedOrders.map(order => {
            const product = products.find(p => p._id.toString() === order.productId.toString());
            return {
                orderId: order._id,
                orderStatus: order.orderStatus,
                rentalDate: order.orderedDate,  
                totalPrice: order.totalPrice,
                quantity: order.quantity,
                rentalDuration: order.rentalDuration,
                product: product ? {
                    productId: product._id,
                    name: product.productName,
                    price: product.price,
                    category: product.category
                } : null
            };
        });
        
       
        
        console.log(response);
        
        res.status(200).json(response);

    } catch (error) {
        console.error("Error fetching rented items:", error.message);
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

const youRentedItems = async (req, res) => {
    try {
        let { userId } = req.params;
        userId = userId.replace(":","");
        
        
        
        const rentedOrders = await FarmingoBuy.find({
            userId: new mongoose.Types.ObjectId(userId),
            isRent: true,
            isReturned: false,
            orderStatus: "Delivered"
        });


        if (!rentedOrders.length) {
            return res.status(404).json({ message: "No rented items found for this seller." });
        }

       
        const productIds = rentedOrders.map(order => order.productId);

        
        const products = await Product.find({ _id: { $in: productIds } });

        
        const response = rentedOrders.map(order => {
            const product = products.find(p => p._id.toString() === order.productId.toString());
            return {
                orderId: order._id,
                orderStatus: order.orderStatus,
                rentalDate: order.orderedDate,  
                totalPrice: order.totalPrice,
                quantity: order.quantity,
                rentalDuration: order.rentalDuration,
                product: product ? {
                    productId: product._id,
                    name: product.productName,
                    price: product.price,
                    category: product.category
                } : null
            };
        });
        
       
        
        console.log(response);
        
        res.status(200).json(response);

    } catch (error) {
        console.error("Error fetching rented items:", error.message);
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

module.exports = {monthlyPurchase,yourPurchaseOrder,yourRentOrder,orderShipped,rentedItems,youRentedItems};