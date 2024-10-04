// controllers/friend.js
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;

    const friend = await User.findById(friendId);
    const sender = await User.findById(userId);

    if (!friend || !sender) {
      return res.status(404).json({ message: "User not found." });
    }

    const existingRequest = await FriendRequest.findOne({ sender: userId, recipient: friendId });
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    const newRequest = await FriendRequest.create({ sender: userId, recipient: friendId });
    res.status(201).json({ message: "Friend request sent.", request: newRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error: Unable to send friend request." });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await FriendRequest.findById(requestId).populate("sender recipient");

    if (!request) return res.status(404).json({ message: "Friend request not found." });

    const { sender, recipient } = request;
    sender.friends.push(recipient._id);
    recipient.friends.push(sender._id);

    await sender.save();
    await recipient.save();
    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Friend request accepted." });
  } catch (error) {
    res.status(500).json({ message: "Server error: Unable to accept friend request." });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found." });
    }

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend removed." });
  } catch (error) {
    res.status(500).json({ message: "Server error: Unable to remove friend." });
  }
};

export const getFriendRequestStatus = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (user.friends.includes(friendId)) {
      return res.status(200).json({ status: "accepted" });
    }

    const request = await FriendRequest.findOne({ sender: userId, recipient: friendId });
    if (request) {
      return res.status(200).json({ status: "pending" });
    }

    res.status(200).json({ status: "none" });
  } catch (error) {
    res.status(500).json({ message: "Server error: Unable to retrieve friend request status." });
  }
};
