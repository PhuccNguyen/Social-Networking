import express from 'express';
import { verifyToken, verifyAssistantAdmin } from '../middleware/auth.js';
import {  getAllCampaigns , registerCampaign, getManagedCampaigns} from '../controllers/campaign.js';

const router = express.Router();

//Get all campaign
router.get('/campaigns', verifyToken, getAllCampaigns);

// Route to handle campaign registration
router.post('/register/:campaignId', verifyToken, registerCampaign);

// Route to get campaigns managed by the logged-in assistant admin or admin
router.get('/manage', verifyToken, verifyAssistantAdmin, getManagedCampaigns);


export default router;
