// routes/notifications.js

import express from "express";
import Notification from "../models/Notification.js";
import { verifyToken } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// Fetch notifications for a user with pagination
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const notifications = await Notification.find({ recipient: req.params.userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Ensure createdAt is in ISO format
    const formattedNotifications = notifications.map((notif) => {
      return {
        ...notif.toObject(),
        createdAt: notif.createdAt.toISOString(), // Convert to ISO string if necessary
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
