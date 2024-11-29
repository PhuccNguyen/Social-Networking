// routes/notifications.js

import express from "express";
import Notification from "../models/Notification.js";
import { verifyToken } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// Get notifications for a user
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Get notifications and populate sender details
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("sender", "firstName lastName picturePath") // Populating sender's information
      .populate("recipient", "firstName lastName picturePath"); // Optionally, you can populate recipient's info too if needed

    const formattedNotifications = notifications.map((notif) => {
      return {
        ...notif.toObject(),
        createdAt: notif.createdAt.toISOString(),
      };
    });

    res.status(200).json(formattedNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark notification as read
router.put("/:userId/markAllRead", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.updateMany(
      { recipient: req.params.userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) { 
    console.error("Error marking notifications as read:", error.message);
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
});

export default router;
