import React, { useEffect, useState, useCallback } from "react";
import { IconButton, Badge, Menu, MenuItem, Typography, Divider } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatDistanceToNow } from "date-fns";
import io from "socket.io-client";
import UserImage from "components/UserImage"; 

const socket = io("http://localhost:3001", { autoConnect: false });

function BellNavbar({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMoreMenuOpen = Boolean(moreMenuAnchor);

  // Memoized fetchNotifications function
  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(`http://localhost:3001/notifications/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications. Status: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setUnreadCount(data.filter((notif) => !notif.isRead).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [userId]);

  // Fetch notifications when component mounts
  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId, fetchNotifications]);

  // Listen for real-time notifications
  useEffect(() => {
    if (!userId) return;

    socket.connect();
    socket.emit("registerUser", userId);

    const handleNotification = (data) => {
      setNotifications((prev) =>
        [data, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
      socket.disconnect();
    };
  }, [userId]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleMoreMenuOpen = (event, notification) => {
    setMoreMenuAnchor(event.currentTarget);
    setNotificationToDelete(notification);
  };
  const handleMoreMenuClose = () => setMoreMenuAnchor(null);

  const handleDeleteNotification = () => {
    if (notificationToDelete) {
      // Implement delete logic here (e.g., making a DELETE request to the backend)
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationToDelete._id)
      );
      handleMoreMenuClose();
      // Call backend to delete the notification if necessary
      console.log("Notification deleted:", notificationToDelete);
    }
  };

  const formatTimeAgo = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? "Invalid date" : formatDistanceToNow(parsedDate, { addSuffix: true });
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen} color="inherit">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          style: { maxHeight: 400, width: "300px" }, // Set maxHeight for scrollable notifications
        }}
      >
        {/* Mark all as read */}
        <MenuItem onClick={handleMenuClose}>
          <Typography variant="body2">Mark all as read</Typography>
        </MenuItem>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <MenuItem
              key={index}
              onClick={() => handleMenuClose()}
              sx={{
                backgroundColor: notif.isRead ? "white" : "#f5f5f5",
                "&:hover": { backgroundColor: "#e0e0e0" },
                display: "flex",
                alignItems: "center",
              }}
            >
              <UserImage image={notif.sender.picturePath} size="35px" /> {/* Display the sender's image */}
              <Typography
                variant="body2"
                color={notif.isRead ? "textSecondary" : "textPrimary"}
                sx={{
                  flex: 1,
                  ml: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <strong>{notif.message}</strong>
                <br />
                <small>{formatTimeAgo(notif.createdAt)}</small>
              </Typography>
              <IconButton onClick={(e) => handleMoreMenuOpen(e, notif)}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={moreMenuAnchor}
                open={isMoreMenuOpen}
                onClose={handleMoreMenuClose}
                PaperProps={{
                  style: { width: "150px" },
                }}
              >
                <MenuItem onClick={handleDeleteNotification}>Delete</MenuItem>
              </Menu>
            </MenuItem>
          ))
        ) : (
          <MenuItem>
            <Typography variant="body2">No new notifications</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

export default BellNavbar;
