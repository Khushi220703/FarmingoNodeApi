const {buyItems} = require("../controller/buyController");
const express = require("express");
const router = express.Router();

router.post("/item/:userId", buyItems);

module.exports = router;