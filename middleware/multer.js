const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;



// Image storage setup
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    
    return {
      folder: "images",
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
      allowed_formats: ["jpg", "jpeg", "png", "gif", "bmp", "webp"],
      resource_type: "image",
    };
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
   
    
    return {
      folder: "videos",
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
      allowed_formats: ["mp4", "avi", "mov", "mkv"],
      resource_type: "video",
    };
  },
});


// Multer middleware for uploading a single image
const uploadImage = multer({
 
  storage: imageStorage,
 
}).single("image");


// Multer middleware for multiple images (up to 5 images)
const uploadMultipleImages = multer({
  storage: imageStorage,
 
}).array("images", 5);


// Multer middleware for uploading a single video
const uploadVideo = multer({
  storage: videoStorage,
 
}).single("video");


// Multer middleware for multiple videos (up to 2 videos)
const uploadMultipleVideos = multer({
  storage: videoStorage,
  
}).array("videos", 2);


// Error handling middleware

const handleMulterErrors = (middleware) => {
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer Error:", err);
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "File too large. Max size: 5MB for images, 50MB for videos." });
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
          
          
          return res.status(400).json({ error: `Unexpected field: '${err.field}'. Please check your form data.` });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        console.error("Unknown Error:", err);
        return res.status(500).json({ error: "An error occurred while uploading." });
      }
      next();
    });
  };
};



module.exports = {
  uploadSingleImage: handleMulterErrors(uploadImage),
  uploadMultipleImages: handleMulterErrors(uploadMultipleImages),
  uploadSingleVideo: handleMulterErrors(uploadVideo),
  uploadMultipleVideos: handleMulterErrors(uploadMultipleVideos),
};