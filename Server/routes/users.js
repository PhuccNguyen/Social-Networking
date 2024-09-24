import express from 'express';
import {
    getUser,
    getUserFriends,
    addRemoveFriends,
    updateUser,
    savePosts,
    getSavedPosts,
} from "../controllers/users.js";
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get("/:id", verifyToken, getUser);

// Update Infor user 
router.patch("/:id", verifyToken, updateUser);

// Get user friends
router.get("/:id/friends", verifyToken, getUserFriends);

// Add or remove friends
router.patch("/:id/:friendId", verifyToken, addRemoveFriends);

// Save or unsave a post
router.patch("/:id/saved", verifyToken, savePosts); 

// Get all saved posts
router.get("/:id/savedPosts", verifyToken, getSavedPosts);

export default router;
