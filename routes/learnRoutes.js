const {getTutorials,addTutorials,getTutorialsById,getRecommendingLesson,likeLesson} = require("../controller/learnController");
const express = require("express");
const router = express.Router();
const {  uploadMultipleImages,
    uploadSingleImage,
    uploadMultipleVideos,
    uploadSingleVideo,  } = require("../middleware/multer");
const {uploadBlogMedia,
  uploadVideoMedia} = require("../middleware/learnMulter");
router.post('/add-blog-lessons',uploadBlogMedia, addTutorials);      
router.post('/add-video-lessons', uploadVideoMedia, addTutorials);
router.get("/get-lessons", getTutorials);
router.get("/get-lesson/:id", getTutorialsById);
router.get("/getRecommendingLesson",getRecommendingLesson);
router.post("/likeLesson/:id",likeLesson);

module.exports = router;