import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {  getAllCampaigns } from '../controllers/campaign.js';
const router = express.Router();

//Get all campaign
router.get('/campaigns', verifyToken, getAllCampaigns);

export default router;
