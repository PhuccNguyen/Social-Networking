import React, { useEffect, useState, useCallback } from "react";
import { IconButton, Badge, Menu, MenuItem, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import io from "socket.io-client";
import UserImage from "components/UserImage";
import styled from "styled-components"; // Add styled-components for animation
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Correct import for MoreVertIcon

const socket = io("http://localhost:3001", { autoConnect: false });

function BellNavbar({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMoreMenuOpen = Boolean(moreMenuAnchor);

  // Fetch notifications
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

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId, fetchNotifications]);

  // Socket connection for real-time notifications
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
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationToDelete._id)
      );
      handleMoreMenuClose();
      console.log("Notification deleted:", notificationToDelete);
    }
  };

  const formatTimeAgo = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? "Invalid date" : formatDistanceToNow(parsedDate, { addSuffix: true });
  };

  return (
    <StyledWrapper>
      <IconButton onClick={handleMenuOpen} color="inherit">
        <Badge badgeContent={unreadCount} color="error">
          <button className="button">
            <svg viewBox="0 0 448 512" className="bell">
              <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" />
            </svg>
          </button>
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          style: { maxHeight: 400, width: "300px" },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Typography variant="body2">Mark all as read</Typography>
        </MenuItem>

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
              <UserImage image={notif.sender.picturePath} size="35px" />
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
            </MenuItem>
          ))
        ) : (
          <MenuItem>
            <Typography variant="body2">No new notifications</Typography>
          </MenuItem>
        )}
      </Menu>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    width: 30px;
    height: 30px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(240, 240, 240);
    border-radius: 50%;
    cursor: pointer;
    transition-duration: 0.3s;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .bell {
    width: 22px;
    transition: transform 0.3s ease;
  }

  .bell path {
    fill: black;
  }

  .button:hover {
    background-color: rgb(220, 220, 220);
  }

  .button:hover .bell {
    animation: bellRing 1s both;
  }

  @keyframes bellRing {
    0%,
    100% {
      transform-origin: top;
    }
    15% {
      transform: rotateZ(10deg);
    }
    30% {
      transform: rotateZ(-10deg);
    }
    45% {
      transform: rotateZ(5deg);
    }
    60% {
      transform: rotateZ(-5deg);
    }
    75% {
      transform: rotateZ(2deg);
    }
  }
`;

export default BellNavbar;
