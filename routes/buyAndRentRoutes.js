const {buyData, rentData,createProduct,updateProduct,recommendedProductsForHome,likeProduct} = require("../controller/buyAndRentController")
const express = require("express");
const router = express.Router();
const { uploadSingleImage } = require("../middleware/multer");

router.get("/get-rent", rentData);
router.get("/get-buy", buyData);
router.post("/addProduct", uploadSingleImage,createProduct);
router.patch("/update", updateProduct);
router.get("/recommendedProductsForHome",recommendedProductsForHome);
router.post("/likeProduct/:id",likeProduct);







module.exports = router;