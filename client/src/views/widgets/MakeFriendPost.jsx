// src/views/widgets/FriendListWidget.jsx
import React, { useEffect } from 'react';
import { Box, Typography, Button, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const FriendListWidget = ({ userId }) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.user.friends || []);

    const getFriends = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}/friends`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setFriends({ friends: data }));
    };

    useEffect(() => {
        getFriends();
    }, [userId]); // Re-fetch when userId changes

    const removeFriend = async (friendId) => {
        try {
            const response = await fetch(`http://localhost:3001/users/${userId}/friends/${friendId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // Update the friends list in Redux
                dispatch(setFriends({ friends: friends.filter(f => f._id !== friendId) }));
            } else {
                console.error("Failed to remove friend");
            }
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    };

    return (
        <Box>
            <Typography
                color={palette.neutral.dark}
                variant="h4"
                fontWeight="600"
                sx={{
                    mb: "1.5rem",
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                }}
            >
                Friend List
            </Typography>
            <Box
                display="flex"
                flexDirection="column"
                gap="1.25rem"
                maxHeight="400px"
                overflowY="auto"
                sx={{
                    "&::-webkit-scrollbar": { width: "8px" },
                    "&::-webkit-scrollbar-thumb": { backgroundColor: "#888", borderRadius: "10px" },
                    "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#555" },
                    padding: "0 0.5rem",
                }}
            >
                {friends.length > 0 ? (
                    friends.map((friend) => (
                        <Box
                            key={friend._id}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            p="0.75rem"
                            sx={{
                                borderRadius: "0.5rem",
                                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                    transform: "scale(1.02)",
                                    boxShadow: "0 5px 12px rgba(0, 0, 0, 0.15)",
                                },
                            }}
                        >
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                {`${friend.firstName} ${friend.lastName}`}
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => removeFriend(friend._id)}
                                sx={{
                                    backgroundColor: "red",
                                    '&:hover': {
                                        backgroundColor: "darkred",
                                    },
                                }}
                            >
                                Remove Friend
                            </Button>
                        </Box>
                    ))
                ) : (
                    <Typography color={palette.neutral.medium} sx={{ textAlign: "center", fontStyle: "italic" }}>
                        No friends to display.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default FriendListWidget;
