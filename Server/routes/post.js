import express from 'express';
const router = express.Router();

import { 
    getFeedPosts, 
    getUserPosts, 
    likePost } from "../controllers/post.js";
    
    import { verifyToken } from '../middleware/auth.js';

    // read
    router.get("/", verifyToken, getFeedPosts);
    router.get("/userId/posts", verifyToken, getUserPosts);

    // save
    router.patch("/:id/like", verifyToken, likePost);

    export default router;

