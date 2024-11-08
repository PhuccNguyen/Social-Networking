// controllers/notification.js
import Notification from './models/Notification.js';
import Post from "./models/Post.js";
import User from "./models/User.js";

// Helper function to create a notification
export const createNotification = async (userId, message, type, relatedId) => {
  const { io } = await import('./index.js'); // Dynamically import io to avoid circular dependencies
  
  const notification = new Notification({
    user: userId,
    message,
    type,
    relatedId,
  });
  await notification.save();

  // Send real-time notification if the user is online
  if (io.onlineUsers.has(userId)) {
    io.to(io.onlineUsers.get(userId)).emit('newNotification', notification);
  }
};

// Additional controller functions for friend request, friend acceptance, post like, comment, etc.
