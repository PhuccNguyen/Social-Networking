import express from 'express';
import { 
  sendFriendRequest, 
  acceptFriendRequest, 
  removeFriend, 
  cancelFriendRequest,
  getFriendRequestStatus
} from "../controllers/friend.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Friend request routes
router.post('/send-request/:senderId/:friendId', verifyToken, sendFriendRequest);
router.patch('/accept-request/:requestId', verifyToken, acceptFriendRequest);
router.delete('/remove-friend/:friendId', verifyToken, removeFriend);

// Route to get friend request status
router.get("/request-status/:senderId/:friendId", verifyToken, getFriendRequestStatus);

// Cancel request
router.delete('/cancel-request/:senderId/:friendId', verifyToken, cancelFriendRequest);

export default router;
