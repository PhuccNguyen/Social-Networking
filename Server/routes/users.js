import express from 'express';
import {
    getUser,
    getUserFriends,
    deleteUserFriend, 
    updateUser,
    savePosts,
    getSavedPosts,
    getUserJoinedCampaigns,
    updateUserAchievements,
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


// Endpoint to get all campaigns a user has joined
router.get("/:userId/joinedcampaigns", verifyToken, getUserJoinedCampaigns);

// Route to get user profile with achievements
router.get("/:id/profileWithAchievements", verifyToken, async (req, res) => {
    try {
      const userId = req.params.id;
      const profile = await updateUserAchievements(userId); // Call the function to update and retrieve achievements
  
      if (!profile) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(profile);
    } catch (error) {
      console.error("Error fetching user profile with achievements:", error);
      res.status(500).json({ message: "Error fetching profile" });
    }
  });


export default router;
