const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const blogImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "images",
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
    allowed_formats: ["jpg", "jpeg", "png", "gif", "bmp", "webp"],
    resource_type: "image",
  }),
});

const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    
    
    folder: "videos",
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
    allowed_formats: ["mp4", "avi", "mov", "mkv"],
    resource_type: "video",
  }),
});

const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "video_images",
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
    allowed_formats: ["jpg", "jpeg", "png", "gif", "bmp", "webp"],
    resource_type: "image",
  }),
});

const uploadBlogMedia = multer({
  storage: blogImageStorage,
}).fields([
  { name: "image", maxCount: 1 }, 
 
  { name: "images", maxCount: 5 },
]);

const uploadVideoMedia = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      if (file.mimetype.startsWith("image/")) {
        return {
          folder: "video_images",
          public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
          allowed_formats: ["jpg", "jpeg", "png", "gif", "bmp", "webp"],
          resource_type: "image",
        };
      } else if (file.mimetype.startsWith("video/")) {
        return {
          folder: "videos",
          public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
          allowed_formats: ["mp4", "avi", "mov", "mkv"],
          resource_type: "video",
        };
      }
      throw new Error("Invalid file type");
    },
  }),
}).fields([
  { name: "image", maxCount: 1 }, 
  { name: "video", maxCount: 1 },
]);

const handleMulterErrors = (middleware) => {
    return (req, res, next) => {
      middleware(req, res, (err) => {
        console.log("Uploaded files:", req.files); // ✅ Log all uploaded files
        console.log("Request body:", req.body); // ✅ Log additional form data
  
        if (!req.files || (!req.files.image && !req.files.images)) {
           
            
          console.warn("No image or images field received!");
        } else {
           
          console.log("Image field:", req.files.image ? req.files.image.length : 0);
          console.log("Images field:", req.files.images ? req.files.images.length : 0);
        }
  
        if (err instanceof multer.MulterError) {
          console.error("Multer Error:", err);
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File too large." });
          } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({ error: `Unexpected field: '${err.field}'.` });
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
  uploadBlogMedia: handleMulterErrors(uploadBlogMedia),
  uploadVideoMedia: handleMulterErrors(uploadVideoMedia),
};
