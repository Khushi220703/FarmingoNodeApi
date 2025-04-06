const express = require("express");
const { signupUserController,loginUser } = require("../controller/signupController");

const router = express.Router()

router.post("/signup", signupUserController);
router.post("/login",loginUser);

module.exports = router;