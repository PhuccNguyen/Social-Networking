import express from 'express';
import { promoteToAssistantAdmin, demoteToUser, getAllUsers, toggleUserActiveStatus } from '../controllers/admin.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { getAssistantAdminsAndCampaigns } from '../controllers/campaign.js'

const router = express.Router();

// Get all users with their roles
router.get('/users', verifyToken, verifyAdmin, getAllUsers);

// Promote user to Assistant Admin
router.patch('/promote/:id', verifyToken, verifyAdmin, promoteToAssistantAdmin);

// Demote Assistant Admin to User
router.patch('/demote/:id', verifyToken, verifyAdmin, demoteToUser);

// Toggle user active status
router.patch('/toggle-user-status/:id', verifyToken, verifyAdmin, toggleUserActiveStatus);


// Get assistant admins and their campaigns
router.get('/assistant-admins-campaigns', verifyToken, verifyAdmin, getAssistantAdminsAndCampaigns);




export default router;
