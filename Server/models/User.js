import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
    lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
    userName: { type: String, required: true, maxlength: 25, unique: true },
    mobile: { type: String, required: true, maxlength: 20, unique: true },
    email: { type: String, required: true, maxlength: 50, unique: true },
    intro: { type: String, maxlength: 10000 },
    gender: { type: String, required: true, maxlength: 50 },
    birthday: { type: Date, required: true },
    status: { type: String, required: true, maxlength: 50 },
    password: { type: String, required: true, minlength: 5 },
    picturePath: { type: String, default: "" },
    location: String,
    occupation: String,
    lastLogin: { type: Date, default: Date.now },
    role: {
      type: String,
      enum: ["user", "admin", "assistantAdmin"],
      default: "user",
    },

    // Friends
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Friend Requests
    friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Chiến dịch đã tham gia (cho User)
    joinedCampaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }], 

    // Chiến dịch được quản lý (cho Admin và Assistant Admin)
    // managedCampaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }],

    isActive: { type: Boolean, default: true }, // Add isActive field


    // Save post
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
