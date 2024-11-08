import Notification from '../models/Notification.js';
import { io } from '../app.js'; 
// import Post from "../models/Post.js";
// import User from "../models/User.js";

// Helper function to create a notification
export const createNotification = async (userId, message, type, relatedId) => {
  const notification = new Notification({
    user: userId,
    message,
    type,
    relatedId,
  });
  await notification.save();
  
  // Send real-time notification
  if (io.onlineUsers.has(userId)) {
    io.to(io.onlineUsers.get(userId)).emit('newNotification', notification);
  }
};

// Controller function for friend request notification
export const sendFriendRequestNotification = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const message = `You have a new friend request from ${req.user.firstName}`;
    
    await createNotification(receiverId, message, 'friendRequest', senderId);

    res.status(200).json({ message: 'Friend request notification sent!' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending friend request notification.' });
  }
};

// Controller function for friend acceptance notification
export const acceptFriendRequestNotification = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const message = `${req.user.firstName} accepted your friend request`;

    await createNotification(senderId, message, 'friendAccepted', receiverId);

    res.status(200).json({ message: 'Friend acceptance notification sent!' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending friend acceptance notification.' });
  }
};

// Controller function for post like notification
export const likePostNotification = async (req, res) => {
  try {
    const { postId, ownerId } = req.body;
    const message = `${req.user.firstName} liked your post`;

    await createNotification(ownerId, message, 'like', postId);

    res.status(200).json({ message: 'Like notification sent!' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending like notification.' });
  }
};

// Controller function for post comment notification
export const commentPostNotification = async (req, res) => {
  try {
    const { postId, ownerId } = req.body;
    const message = `${req.user.firstName} commented on your post`;

    await createNotification(ownerId, message, 'comment', postId);

    res.status(200).json({ message: 'Comment notification sent!' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending comment notification.' });
  }
};

// Controller function for new post notification
export const newPostNotification = async (req, res) => {
  try {
    const { postId, friendIds } = req.body; // List of friend IDs to notify
    const message = `${req.user.firstName} posted a new update`;

    for (const friendId of friendIds) {
      await createNotification(friendId, message, 'newPost', postId);
    }

    res.status(200).json({ message: 'New post notification sent to friends!' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending new post notification.' });
  }
};
