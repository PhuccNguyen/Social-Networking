import express from 'express';
import {
    getUser,
    getUserFriends,
    addRemoveFriends,
} from "../controllers/users.js";
import { verifyToken } from '../middleware/auth.js';

const router  = express.Router();

// Get user profile
router.get("/:id", verifyToken, getUser);

// Get user friends
router.get("/:id/friends", verifyToken, getUserFriends);

// Add or remove friends
router.patch("/:id/:friendId", verifyToken, addRemoveFriends);
 
export default router;