import { PersonAddOutlined, PersonRemoveOutlined, HourglassEmptyOutlined } from "@mui/icons-material";
import { Box, Button, Typography, useTheme } from "@mui/material";
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

    // Fetch the friend request status when the component mounts
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

    // Render the correct button based on the current friend request status
    const renderActionButton = () => {
        switch (friendRequestStatus) {
            case "not_friends":
                return <Button onClick={handleSendFriendRequest} variant="contained" color="primary" startIcon={<PersonAddOutlined />}>Add Friend</Button>;
            case "request_sent":
                return <Button onClick={handleCancelFriendRequest} variant="contained" color="warning" startIcon={<HourglassEmptyOutlined />}>Cancel Request</Button>;
            case "request_received":
                return <Button onClick={handleAcceptFriendRequest} variant="contained" color="primary" startIcon={<PersonAddOutlined />}>Accept Request</Button>;
            case "friends":
                return <Button onClick={handleCancelFriendRequest} variant="contained" color="secondary" startIcon={<PersonRemoveOutlined />}>Remove Friend</Button>;
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
            {renderActionButton()}
        </Box>
    );
};

export default BoxFriend;
