import express from 'express';
import { 
  sendFriendRequestNotification, 
  acceptFriendRequestNotification, 
  likePostNotification, 
  commentPostNotification,
  newPostNotification
} from '../controllers/notification.js';

const router = express.Router();

router.post('/friendRequest', sendFriendRequestNotification);
router.post('/friendAccepted', acceptFriendRequestNotification);
router.post('/likePost', likePostNotification);
router.post('/commentPost', commentPostNotification);
router.post('/newPost', newPostNotification);

export default router;
