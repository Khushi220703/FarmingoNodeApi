const {getShorts,addShorts,liking,addCommments} = require("../controller/shortsController");
const upload = require("../middleware/multer")
const express = require("express");
const router = express.Router();
const { uploadMultipleImages, uploadMultipleVideos } = require("../middleware/multer");

router.get("/get-shorts", getShorts);
router.post("/add-shorts", uploadMultipleImages, uploadMultipleVideos,addShorts);
router.put("/like", liking);
router.put("/add-comment", addCommments);

module.exports = router;