// routes/friend.js
import express from "express";
import { sendFriendRequest, acceptFriendRequest, removeFriend, getFriendRequestStatus } from "../controllers/friend.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/send-request/:friendId", verifyToken, sendFriendRequest);
router.patch("/accept-request/:requestId", verifyToken, acceptFriendRequest);
router.delete("/remove-friend/:friendId", verifyToken, removeFriend);
router.get("/request-status/:friendId", verifyToken, getFriendRequestStatus);

export default router;
