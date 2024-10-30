import express from 'express';
import { promoteToAssistantAdmin, demoteToUser, getAllUsers } from '../controllers/admin.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';


const router = express.Router();

// Get all users with their roles
router.get('/users', verifyToken, verifyAdmin, getAllUsers);

// Promote user to Assistant Admin
router.patch('/promote/:id', verifyToken, verifyAdmin, promoteToAssistantAdmin);

// Demote Assistant Admin to User
router.patch('/demote/:id', verifyToken, verifyAdmin, demoteToUser);

export default router;
