// routes/friend.js

import express from 'express';
import {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    getUserFriends,
    getFriendRequestStatus,
    deleteFriend,
    getFriendRequestsReceived,
    getFriendRequestsSent,
    getFriendSuggestions,
    getUserFriendRequests,
    getSentFriendRequests
} from '../controllers/friend.js';

const router = express.Router();

router.post("/send-request", sendFriendRequest);
router.post("/accept-request", acceptFriendRequest);
router.post("/reject-request", rejectFriendRequest);

router.post("/cancel-request", cancelFriendRequest);
router.get("/:userId/friends", getUserFriends);
router.get("/:userId/:targetUserId/friend-status", getFriendRequestStatus);

router.post("/delete-friend", deleteFriend);
router.get("/:userId/requests-received", getFriendRequestsReceived);
router.get("/:userId/requests-sent", getFriendRequestsSent);

router.get('/:userId/suggestions', getFriendSuggestions);
router.get('/:userId/requests', getUserFriendRequests);
router.get('/:userId/sent-requests', getSentFriendRequests);



export default router;
