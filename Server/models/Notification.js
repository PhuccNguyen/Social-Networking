import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['friendRequest', 'friendAccepted', 'like', 'comment', 'newPost'], // Types of notifications
    required: true,
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to related item, like a post or user
    refPath: 'type',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
