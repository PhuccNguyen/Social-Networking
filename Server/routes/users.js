import express from 'express';
import {
    getUser,
    getUserFriends,
    deleteUserFriend, 
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

// Delete a friend
router.delete("/:id/friends/:friendId", verifyToken, deleteUserFriend);

// Get user friends
router.get("/:id/friends", verifyToken, getUserFriends);

// Save or unsave a post
router.post("/:id/saved", (req, res, next) => {
       console.log("Middleware: Route accessed");
    next();
}, verifyToken, (req, res, next) => {
    console.log("Middleware: Token verified");
    next();
}, savePosts);


// Get all saved posts
router.post("/:id/savedPosts", verifyToken, getSavedPosts);

export default router;
