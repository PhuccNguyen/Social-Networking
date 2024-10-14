import express from 'express';
import { createCampaign } from '../controllers/campaignController.js';  // Import controller createCampaign
import { verifyToken, verifyAssistantAdmin } from '../middleware/auth.js';  // Middleware để kiểm tra quyền truy cập

const router = express.Router();

// Route để tạo chiến dịch mới
router.post('/campaigns', verifyToken, verifyAssistantAdmin, createCampaign);

export default router;
