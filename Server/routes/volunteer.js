import express from 'express';
import { createCampaign } from '../controllers/campaign.js';  // Import controller createCampaign
import { verifyToken, verifyAssistantAdmin } from '../middleware/auth.js';  // Middleware để kiểm tra quyền truy cập
import multer from 'multer';  // Để upload ảnh

// Thiết lập multer cho việc lưu ảnh chiến dịch
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");  // Nơi lưu trữ file ảnh
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);  // Tên file lưu giữ nguyên
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước file là 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const router = express.Router();

// Route để tạo chiến dịch mới, hỗ trợ upload ảnh
router.post('/campaigns', verifyToken, verifyAssistantAdmin, upload.single('image'), createCampaign);

export default router;
