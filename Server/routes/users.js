import express from 'express';
import {
    getUser,
    getUserFriends,
    addRemoveFriends,
    updateUser,
} from "../controllers/users.js";
import { verifyToken } from '../middleware/auth.js';

const router  = express.Router();

// Get user profile
router.get("/:id", verifyToken, getUser);

// Update Infor user 
router.patch("/:id", verifyToken, updateUser);

// Get user friends
router.get("/:id/friends", verifyToken, getUserFriends);

// Add or remove friends
router.patch("/:id/:friendId", verifyToken, addRemoveFriends);

// router.patch("/:id/changepassword", verifyToken, changePassword);

// router.patch("/:id", verifyToken, updateContact);


export default router;