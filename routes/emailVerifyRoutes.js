const {verifyEmail} = require("../controller/emailVerifyController");
const express = require("express");
const router = express.Router();

router.post("/get-verified", verifyEmail);

module.exports = router;