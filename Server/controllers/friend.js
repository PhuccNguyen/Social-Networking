import User from "../models/User.js";

/* SEND FRIEND REQUEST */
export const sendFriendRequest = async (req, res) => {
    try {
        const { userId, targetUserId } = req.body;

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if a request has already been sent
        if (targetUser.friendRequestsReceived.includes(userId)) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        // Add the user to sent requests and the target to received requests
        user.friendRequestsSent.push(targetUserId);
        targetUser.friendRequestsReceived.push(userId);

        await user.save();
        await targetUser.save();

        res.status(200).json({ message: "Friend request sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error sending friend request" });
    }
};

/* ACCEPT FRIEND REQUEST */
export const acceptFriendRequest = async (req, res) => {
    try {
        const { userId, requesterId } = req.body;

        const user = await User.findById(userId);
        const requester = await User.findById(requesterId);

        if (!requester) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.friendRequestsReceived.includes(requesterId)) {
            return res.status(400).json({ message: "No friend request found" });
        }

        // Update the friend lists
        user.friends.push(requesterId);
        requester.friends.push(userId);

        // Remove friend request from both users
        user.friendRequestsReceived = user.friendRequestsReceived.filter(id => id.toString() !== requesterId);
        requester.friendRequestsSent = requester.friendRequestsSent.filter(id => id.toString() !== userId);

        await user.save();
        await requester.save();

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        res.status(500).json({ message: "Error accepting friend request" });
    }
};

/* REJECT FRIEND REQUEST */
export const rejectFriendRequest = async (req, res) => {
    try {
        const { userId, requesterId } = req.body;

        const user = await User.findById(userId);
        const requester = await User.findById(requesterId);

        if (!requester) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.friendRequestsReceived.includes(requesterId)) {
            return res.status(400).json({ message: "No friend request found" });
        }

        // Remove the request
        user.friendRequestsReceived = user.friendRequestsReceived.filter(id => id.toString() !== requesterId);
        requester.friendRequestsSent = requester.friendRequestsSent.filter(id => id.toString() !== userId);

        await user.save();
        await requester.save();

        res.status(200).json({ message: "Friend request rejected" });
    } catch (error) {
        res.status(500).json({ message: "Error rejecting friend request" });
    }
};

/* CANCEL FRIEND REQUEST */
export const cancelFriendRequest = async (req, res) => {
    try {
        const { userId, targetUserId } = req.body;

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.friendRequestsSent.includes(targetUserId)) {
            return res.status(400).json({ message: "No friend request to cancel" });
        }

        // Remove request
        user.friendRequestsSent = user.friendRequestsSent.filter(id => id.toString() !== targetUserId);
        targetUser.friendRequestsReceived = targetUser.friendRequestsReceived.filter(id => id.toString() !== userId);

        await user.save();
        await targetUser.save();

        res.status(200).json({ message: "Friend request cancelled" });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling friend request" });
    }
};

/* GET FRIEND LIST */
export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map(friendId => User.findById(friendId))
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, userName, picturePath }) => {
                return { _id, firstName, lastName, userName, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* ADD OR REMOVE FRIEND */
export const addRemoveFriends = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter(friend => friend !== friendId);
            friend.friends = friend.friends.filter(f => f !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map(friendId => User.findById(friendId))
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, userName, picturePath }) => {
                return { _id, firstName, lastName, userName, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* GET FRIEND REQUEST STATUS */
export const getFriendRequestStatus = async (req, res) => {
    try {
        const { userId, targetUserId } = req.params;

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check the status between the two users
        if (user.friends.includes(targetUserId)) {
            return res.status(200).json({ status: "friends" });
        } else if (user.friendRequestsSent.includes(targetUserId)) {
            return res.status(200).json({ status: "request_sent" });
        } else if (user.friendRequestsReceived.includes(targetUserId)) {
            return res.status(200).json({ status: "request_received" });
        } else {
            return res.status(200).json({ status: "not_friends" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching friend request status" });
    }
};

// Other friend-related methods here (addRemoveFriends, accept, reject, etc.)
