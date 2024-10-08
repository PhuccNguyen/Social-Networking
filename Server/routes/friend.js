import express from 'express';
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, getUserFriends, getFriendRequestStatus } from '../controllers/friend.js';

const router = express.Router();

router.post("/send-request", sendFriendRequest);
router.post("/accept-request", acceptFriendRequest);
router.post("/reject-request", rejectFriendRequest);
router.post("/cancel-request", cancelFriendRequest);
router.get("/:userId/friends", getUserFriends);
router.get("/:userId/:targetUserId/friend-status", getFriendRequestStatus);

export default router;
