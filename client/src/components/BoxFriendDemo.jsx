import { MoreHoriz, PersonAddOutlined, PersonRemoveOutlined, CheckCircleOutline } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import UserImage from "./UserImage";
import { useState, useEffect } from "react";

const BoxFriend = ({ friendId, firstName, lastName, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends || []);
  const [anchorEl, setAnchorEl] = useState(null);
  const [friendRequestStatus, setFriendRequestStatus] = useState(null);

  const { palette } = useTheme();
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.some((friend) => friend._id === friendId);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const fetchFriendRequestStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3001/friends/request-status/${friendId}`, {
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
      url = `http://localhost:3001/friends/send-request/${friendId}`;
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
      if (!response.ok) throw new Error('Failed to process friend request');

      const data = await response.json();
      if (method === "DELETE") dispatch(setFriends({ friends: data }));
      setFriendRequestStatus(null);
      handleClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchFriendRequestStatus();
  }, []);

  return (
    <Box display="flex" alignItems="center" gap="1rem" p="0.5rem">
      <UserImage image={userPicturePath} size="55px" />
      <Box
        onClick={() => {
          navigate(`/profile/${friendId}`);
          navigate(0);
        }}
        sx={{ flex: 1, cursor: "pointer" }}
      >
        <Typography color={main} variant="h5" fontWeight="500">
          {firstName} {lastName}
        </Typography>
        <Typography color={medium} fontSize="0.75rem">
          {subtitle}
        </Typography>
      </Box>

      {/* Nút ba chấm */}
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
      </Menu>
    </Box>
  );
};

export default BoxFriend;
