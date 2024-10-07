import express from 'express';
import { 
  sendFriendRequest, 
  acceptFriendRequest, 
  removeFriend, 
  followUser, 
  unfollowUser,
  cancelFriendRequest,
  getFriendRequestStatus
} from "../controllers/friend.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Friend request routes
router.post('/send-request/:senderId/:friendId', verifyToken, sendFriendRequest);
router.patch('/accept-request/:friendId', verifyToken, acceptFriendRequest);
router.delete('/remove-friend/:friendId', verifyToken, removeFriend);

// New cancel route for pending requests
router.delete('/cancel-request/:senderId/:friendId', verifyToken, cancelFriendRequest);


router.get('/request-status/:senderId/:friendId', verifyToken, getFriendRequestStatus);


// Follow-related routes
router.post('/follow/:friendId', verifyToken, followUser);
router.delete('/unfollow/:friendId', verifyToken, unfollowUser);

export default router;
