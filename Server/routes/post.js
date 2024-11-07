import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  addComment,
  getFriendPosts,
  getTrendingPosts,
  editPost,
  deletePost,
} from "../controllers/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// get all posts
router.get("/", verifyToken, getFeedPosts);

// get user posts
router.get("/:userId/posts", verifyToken, getUserPosts);

// get posts from friends
router.get("/friends", verifyToken, getFriendPosts);

//like posts
router.patch("/:id/like", verifyToken, likePost);

//trending
router.get("/trending", getTrendingPosts);

// Edit post route
router.patch("/:postId/edit", verifyToken, editPost);

// Delete post route
router.delete("/:postId", verifyToken, deletePost);

// add comment
router.post("/:postId/comment", verifyToken, addComment);

export default router;
