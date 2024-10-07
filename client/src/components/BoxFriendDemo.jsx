import { MoreHoriz, PersonAddOutlined, PersonRemoveOutlined, HourglassEmptyOutlined } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state"; // update redux state
import UserImage from "./UserImage";
import { useState, useEffect } from "react";

const BoxFriend = ({ friendId, firstName, lastName, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const { _id: senderId } = useSelector((state) => state.user); // Get the logged-in user's ID as senderId
  const friends = useSelector((state) => state.user.friends || []);
  const [anchorEl, setAnchorEl] = useState(null);
  const [friendRequestStatus, setFriendRequestStatus] = useState("none"); // default status is "none"

  const { palette } = useTheme();
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  // Check if user is already a friend
  const isFriend = friends.some((friend) => friend._id === friendId);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Fetch the current friend request status (pending/accepted)
  const fetchFriendRequestStatus = async () => {
    try {
      const response = await fetch(`/friends/request-status/${senderId}/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setFriendRequestStatus(data.status); // Update friend request status
    } catch (error) {
      console.error("Failed to fetch friend request status:", error.message);
    }
  };

  // Handle Friend Action (send, cancel)
  const handleFriendAction = async (action) => {
    let url = '';
    let method = '';

    if (action === "add") {
      url = `http://localhost:3001/friends/send-request/${senderId}/${friendId}`;
      method = "POST";
    } else if (action === "cancel") {
      url = `http://localhost:3001/friends/cancel-request/${senderId}/${friendId}`;
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
        throw new Error("Failed to process friend request");
      }

      if (method === "DELETE") {
        setFriendRequestStatus("none"); // Reset status after cancellation
      } else {
        setFriendRequestStatus("pending"); // Set status to pending after sending
      }
      handleClose(); // Close the options menu
    } catch (error) {
      console.error("Friend request error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Fetch the friend request status when the component mounts
  useEffect(() => {
    fetchFriendRequestStatus(); // Load the friend request status on mount
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
          <MenuItem onClick={() => handleFriendAction("cancel")}>
            <HourglassEmptyOutlined sx={{ mr: 1 }} /> Pending (Click to Cancel)
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleFriendAction("add")}>
            <PersonAddOutlined sx={{ mr: 1 }} /> Add Friend
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default BoxFriend;
