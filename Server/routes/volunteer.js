import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {  getAllCampaigns , registerCampaign} from '../controllers/campaign.js';
const router = express.Router();

//Get all campaign
router.get('/campaigns', verifyToken, getAllCampaigns);

// Route to handle campaign registration
router.post("/register/:campaignId", verifyToken, registerCampaign);


export default router;
