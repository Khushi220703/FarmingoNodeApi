const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");


router.post("/add", cartController.addToCart);


router.put("/update/:id", cartController.updateCart);

router.put("/updateRentalDuration/:id", cartController.updateRentalDuration);

router.get("/:userId", cartController.getUserCart);


router.delete("/delete/:id", cartController.deleteCartItem);

router.delete("/clear/:userId", cartController.clearCart);
module.exports = router;
