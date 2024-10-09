import { PersonAddOutlined, PersonRemoveOutlined, HourglassEmptyOutlined, MoreHoriz, DeleteOutline  } from "@mui/icons-material";
import { Box, Button, Typography, useTheme, IconButton, Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UserImage from "./UserImage";

const BoxFriend = ({ friendId, firstName, lastName, subtitle, userPicturePath }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const { _id: loggedInUserId } = useSelector((state) => state.user);

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    const [friendRequestStatus, setFriendRequestStatus] = useState("not_friends");
    const [anchorEl, setAnchorEl] = useState(null); // Để mở Menu

    // Lấy trạng thái kết bạn khi component được mount
    useEffect(() => {
        const fetchFriendRequestStatus = async () => {
            try {
                const response = await fetch(`http://localhost:3001/friends/${loggedInUserId}/${friendId}/friend-status`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setFriendRequestStatus(data.status);
            } catch (error) {
                console.error("Error fetching friend request status:", error);
            }
        };

        fetchFriendRequestStatus();
    }, [friendId, loggedInUserId, token]);

    const handleSendFriendRequest = async () => {
        try {
            await fetch(`http://localhost:3001/friends/send-request`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: loggedInUserId, targetUserId: friendId }),
            });
            setFriendRequestStatus("request_sent");
        } catch (error) {
            console.error("Error sending friend request:", error);
        }
    };

    const handleAcceptFriendRequest = async () => {
        try {
            await fetch(`http://localhost:3001/friends/accept-request`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: loggedInUserId, requesterId: friendId }),
            });
            setFriendRequestStatus("friends");
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    const handleCancelFriendRequest = async () => {
        try {
            await fetch(`http://localhost:3001/friends/cancel-request`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: loggedInUserId, targetUserId: friendId }),
            });
            setFriendRequestStatus("not_friends");
        } catch (error) {
            console.error("Error canceling friend request:", error);
        }
    };

    const handleDeleteFriend = async () => {
        try {
            await fetch(`http://localhost:3001/friends/delete-friend`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: loggedInUserId, friendId }),
            });
            setFriendRequestStatus("not_friends"); // Cập nhật lại trạng thái
            handleMenuClose(); // Đóng menu sau khi xóa bạn
        } catch (error) {
            console.error("Error deleting friend:", error);
        }
    };

    const handleMenuClick = (event) => {
        if (loggedInUserId === friendId) {
            return null;
        }
        setAnchorEl(event.currentTarget); // Mở menu
    };

    const handleMenuClose = () => {
        setAnchorEl(null); // Đóng menu
    };

    const renderActionButton = () => {
        if (loggedInUserId === friendId) {
            return null;
        }

        switch (friendRequestStatus) {
            case "not_friends":
                return <MenuItem onClick={handleSendFriendRequest}>Add Friend</MenuItem>;
            case "request_sent":
                return <MenuItem onClick={handleCancelFriendRequest}>Cancel Request</MenuItem>;
            case "request_received":
                return <MenuItem onClick={handleAcceptFriendRequest}>Accept Request</MenuItem>;
            case "friends":
                return (
                    <MenuItem onClick={handleDeleteFriend} startIcon={<DeleteOutline />}> 
                      Remove Friend
                    </MenuItem>
                );
            default:
                return null;
        }
    };

    return (
        <Box display="flex" alignItems="center" gap="1rem" p="0.5rem">
            <UserImage image={userPicturePath} size="55px" />
            <Box onClick={() => navigate(`/profile/${friendId}`)} sx={{ flex: 1, cursor: "pointer" }}>
                <Typography color={main} variant="h5" fontWeight="500">{firstName} {lastName}</Typography>
                <Typography color={medium} fontSize="0.75rem">{subtitle}</Typography>
            </Box>


             
            <IconButton onClick={handleMenuClick}>
                <MoreHoriz />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {renderActionButton()}
            </Menu>

        </Box>
    );
};

export default BoxFriend;
