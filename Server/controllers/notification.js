import { io } from "../index.js";

// Send Notification in Real-Time
export const sendNotification = async (req, res) => {
  const { userId, message } = req.body;

  try {
    const socketId = io.onlineUsers.get(userId); // Check if the user is online
    if (socketId) {

      io.to(socketId).emit("notification", { message });
      return res.status(200).json({ success: true, message: "Notification sent successfully!" });
    } else {
      // User is offline (optional: save notification to DB for later delivery)
      return res.status(200).json({ success: false, message: "User offline. Notification not delivered." });
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ success: false, error: "Failed to send notification." });
  }
};
