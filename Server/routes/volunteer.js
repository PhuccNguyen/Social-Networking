import express from 'express';
import { verifyToken, verifyAssistantAdmin } from '../middleware/auth.js';
import {   registerCampaign, getManagedCampaigns, editCampaign, 
    deleteCampaign , getCampaignsByStatusUser , getCampaignCounts,
     getCampaignsByStatus, getAllCampaignsForManage} from '../controllers/campaign.js';

const router = express.Router();

// Route to handle campaign registration
router.post('/register/:campaignId', verifyToken, registerCampaign);

// Route to get campaigns managed by the logged-in assistant admin or admin
router.get('/manage', verifyToken, verifyAssistantAdmin, getManagedCampaigns);

// Route to edit a specific campaign
router.put('/edit/:campaignId', verifyToken, verifyAssistantAdmin, editCampaign);

// Route to delete a specific campaign
router.delete('/delete/:campaignId', verifyToken, verifyAssistantAdmin, deleteCampaign);

// New route to fetch campaign counts by status
router.get('/campaign-counts', verifyToken, getCampaignCounts);

// Add to routes/campaign.js
router.get('/campaigns-by-status', verifyToken, getCampaignsByStatus);

router.get('/campaigns-by-status-user', verifyToken, getCampaignsByStatusUser);

//Get all campaign for manager
router.get('/campaignsformanage', verifyToken, getAllCampaignsForManage);

export default router;
