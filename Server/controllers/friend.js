import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, friendId } = req.params; // Extract both sender and recipient from params

    // Check if both IDs are valid
    if (!senderId || !friendId) {
      return res.status(400).json({ message: "Sender and recipient are required." });
    }

    // Fetch recipient
    const recipient = await User.findById(friendId);
    if (!recipient) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Create a new friend request
    const newFriendRequest = new FriendRequest({
      sender: senderId,
      recipient: friendId,
    });

    await newFriendRequest.save();
    return res.status(201).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to send friend request" });
  }
};





// Accept a Friend Request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId).populate("sender recipient");

    if (!friendRequest) return res.status(404).json({ message: "Friend request not found" });

    const { sender, recipient } = friendRequest;
    sender.friends.push(recipient._id);
    recipient.friends.push(sender._id);

    await sender.save();
    await recipient.save();
    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a Friend
export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) return res.status(404).json({ message: "User not found" });

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Follow a User
export const followUser = async (req, res) => {
  try {
    const { followId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const followUser = await User.findById(followId);

    if (!user || !followUser) return res.status(404).json({ message: "User not found" });

    if (!user.following.includes(followId)) {
      user.following.push(followId);
      await user.save();
      res.status(200).json({ followedUsers: user.following });
    } else {
      res.status(400).json({ message: "Already following" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unfollow a User
export const unfollowUser = async (req, res) => {
  try {
    const { followId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.following = user.following.filter(id => id.toString() !== followId);
    await user.save();

    res.status(200).json({ followedUsers: user.following });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Friend Request Status
export const getFriendRequestStatus = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findOne({ sender: userId, recipient: friendId });

    if (request) {
      res.status(200).json({ status: "pending" });
    } else {
      res.status(200).json({ status: "none" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get posts from followed users
export const getFollowedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("following");

    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ userId: { $in: user.following } });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
