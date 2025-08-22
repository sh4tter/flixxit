const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const verifyToken = require("../verifyToken");

// Test route to check if the router is working
router.get("/test", (req, res) => {
  res.json({ message: "Upload router is working" });
});

// Function to configure Cloudinary - called when needed
const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  console.log("Cloudinary config check:", {
    cloudName: cloudName ? "Set" : "Missing",
    apiKey: apiKey ? "Set" : "Missing", 
    apiSecret: apiSecret ? "Set" : "Missing"
  });

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Cloudinary credentials not configured. Please check your .env file.");
    console.error("Required variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
    throw new Error("Cloudinary credentials missing");
  }

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return { cloudName, apiKey, apiSecret };
};

// Configure multer storage for Cloudinary - will be created when first upload happens
let storage = null;
let upload = null;

const getUploadMiddleware = () => {
  if (!upload) {
    configureCloudinary(); // This will check env vars when first upload happens
    
    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "flixxit",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      },
    });

    upload = multer({ storage: storage });
  }
  return upload;
};

// Upload image endpoint
router.post("/image", verifyToken, (req, res, next) => {
  try {
    const uploadMiddleware = getUploadMiddleware();
    uploadMiddleware.single("image")(req, res, next);
  } catch (error) {
    return res.status(500).json({ message: "Upload configuration failed", error: error.message });
  }
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File uploaded successfully:", req.file.path);
    
    res.status(200).json({
      message: "File uploaded successfully",
      url: req.file.path,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

// Upload video endpoint
router.post("/video", verifyToken, (req, res, next) => {
  try {
    const uploadMiddleware = getUploadMiddleware();
    uploadMiddleware.single("video")(req, res, next);
  } catch (error) {
    return res.status(500).json({ message: "Upload configuration failed", error: error.message });
  }
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Video uploaded successfully:", req.file.path);
    
    res.status(200).json({
      message: "Video uploaded successfully",
      url: req.file.path,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Video upload error:", error);
    res.status(500).json({ message: "Video upload failed", error: error.message });
  }
});

module.exports = router;
