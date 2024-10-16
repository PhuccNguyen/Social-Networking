// import express from 'express';
// import { verifyToken, verifyAssistantAdmin } from '../middleware/auth.js';
// import { createCampaign } from '../controllers/campaign.js';
// import multer from 'multer';  // For handling file uploads

// // Set up multer for image uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/assets");  // Destination folder for the uploaded images
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);  // Use the original file name
//   }
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 },  // Limit file size to 10MB
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed!'), false);  // Reject non-image files
//     }
//   }
// });

// const router = express.Router();

// // Route to create a new campaign, requires Assistant Admin or Admin role
// router.post(
//   '/campaigns',
//   verifyToken,                // Verify token
//   verifyAssistantAdmin,        // Only assistantAdmin or admin can create a campaign
//   upload.single('image'),      // Handle image uploads (this 'image' must match the frontend field name)
//   createCampaign               // Call the controller function
// );

// export default router;
