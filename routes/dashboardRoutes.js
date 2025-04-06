const express = require("express");
const router = express.Router();
const {monthlyPurchase,yourPurchaseOrder,yourRentOrder,orderShipped,rentedItems,youRentedItems} = require("../controller/dashboardController")

router.get("/monthlyPurchase/:sellerId", monthlyPurchase);
router.get("/yourPurchaseOrder/:sellerId",yourPurchaseOrder);
router.get("/yourRentOrder/:sellerId",yourRentOrder);
router.put("/orderShipped/:orderId",orderShipped);
router.get("/rented/:sellerId",rentedItems);
router.get("/youRentedItems/:userId",youRentedItems);

module.exports = router;