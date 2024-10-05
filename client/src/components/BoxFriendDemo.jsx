import { MoreHoriz, PersonAddOutlined, PersonRemoveOutlined, CheckCircleOutline } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, setFollowedUsers } from "state"; // update redux state
import UserImage from "./UserImage";
import { useState, useEffect } from "react";

const BoxFriend = ({ friendId, firstName, lastName, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const { _id: senderId } = useSelector((state) => state.user); // Get the logged-in user's ID as senderId
  const friends = useSelector((state) => state.user.friends || []);
  const followedUsers = useSelector((state) => state.user.following || []);
  const [anchorEl, setAnchorEl] = useState(null);
  const [friendRequestStatus, setFriendRequestStatus] = useState(null); // "pending", "accepted", or "none"
  const [isFollowing, setIsFollowing] = useState(false);

  const { palette } = useTheme();
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  // Check if user is already a friend or being followed
  const isFriend = friends.some((friend) => friend._id === friendId);
  const isFollowed = followedUsers.includes(friendId);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Fetch the current friend request status (pending/accepted)
  const fetchFriendRequestStatus = async () => {
    try {
      const response = await fetch(`/friends/request-status/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setFriendRequestStatus(data.status);
    } catch (error) {
      console.error("Failed to fetch friend request status:", error.message);
    }
  };

  const handleFriendAction = async (action) => {
    let url = '';
    let method = '';

    if (action === "add") {
      // Pass both senderId and friendId in the URL for adding a friend
      url = `http://localhost:3001/friends/send-request/${senderId}/${friendId}`;
      method = "POST";
    } else if (action === "accept") {
      url = `http://localhost:3001/friends/accept-request/${friendId}`;
      method = "PATCH";
    } else if (action === "remove") {
      url = `http://localhost:3001/friends/remove-friend/${friendId}`;
      method = "DELETE";
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Friend not found');
        } else if (response.status === 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Failed to process friend request');
        }
      }

      const data = await response.json();
      if (method === "DELETE") {
        dispatch(setFriends({ friends: data })); // Update friends if removed
      }
      setFriendRequestStatus(null); // Reset status after handling
      handleClose(); // Close the options menu
    } catch (error) {
      console.error("Friend request error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const handleFollowAction = async () => {
    const url = isFollowed
      ? `http://localhost:3001/friends/unfollow/${friendId}`
      : `http://localhost:3001/friends/follow/${friendId}`;
    const method = isFollowed ? "DELETE" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        } else if (response.status === 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Failed to follow/unfollow');
        }
      }

      const data = await response.json();
      setIsFollowing(!isFollowed); // Toggle following state
      dispatch(setFollowedUsers(data.followedUsers)); // Update followed users in Redux
    } catch (error) {
      console.error("Follow/unfollow error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchFriendRequestStatus();
  }, []);

  return (
    <Box display="flex" alignItems="center" gap="1rem" p="0.5rem">
      <UserImage image={userPicturePath} size="55px" />
      <Box onClick={() => navigate(`/profile/${friendId}`)} sx={{ flex: 1, cursor: "pointer" }}>
        <Typography color={main} variant="h5" fontWeight="500">
          {firstName} {lastName}
        </Typography>
        <Typography color={medium} fontSize="0.75rem">{subtitle}</Typography>
      </Box>

      <IconButton onClick={handleClick}>
        <MoreHoriz sx={{ color: primaryDark }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {isFriend ? (
          <MenuItem onClick={() => handleFriendAction("remove")}>
            <PersonRemoveOutlined sx={{ mr: 1 }} /> Remove Friend
          </MenuItem>
        ) : friendRequestStatus === "pending" ? (
          <MenuItem onClick={() => handleFriendAction("accept")}>
            <CheckCircleOutline sx={{ mr: 1 }} /> Accept Request
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleFriendAction("add")}>
            <PersonAddOutlined sx={{ mr: 1 }} /> Add Friend
          </MenuItem>
        )}
        <MenuItem onClick={handleFollowAction}>
          {isFollowed ? "Unfollow" : "Follow"}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default BoxFriend;
