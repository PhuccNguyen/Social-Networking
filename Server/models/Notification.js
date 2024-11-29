// models/Notification.js

import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    type: { 
      type: String, 
      required: true, 
      enum: ["friendRequest", "friendRequestAccepted", "like", "comment", "message"] 
    },
    message: { 
      type: String, 
      required: true 
    },
    isRead: { 
      type: Boolean, 
      default: false 
    },
    link: { 
      type: String, 
      required: false 
    },
    priority: { 
      type: String, 
      enum: ["low", "medium", "high"], 
      default: "medium"
    }
  },
  { timestamps: true }
);

// Ensure `createdAt` is always in ISO format
NotificationSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.createdAt) {
      ret.createdAt = ret.createdAt.toISOString();  // Convert Date object to ISO string
    }
    return ret;
  }
});

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
