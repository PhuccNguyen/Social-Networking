// src/views/widgets/FriendListWidget.jsx
import React, { useEffect } from 'react';
import { Box, Typography, Button, useTheme, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import UserImage from "components/UserImage";
import { motion } from "framer-motion";

const FriendListWidget = ({ userId }) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const navigate = useNavigate();
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
    }, [userId]);

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
                        <motion.div
                            key={friend._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Paper 
                                elevation={3} 
                                sx={{ 
                                    marginBottom: '1rem', 
                                    padding: '1rem', 
                                    borderRadius: "0.5rem", 
                                    background: palette.background.default,
                                    "&:hover": { 
                                        background: palette.background.paper,
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)"
                                    }
                                }}
                            >
                                <Box 
                                    display="flex" 
                                    alignItems="center" 
                                    justifyContent="space-between"
                                    onClick={() => navigate(`/profile/${friend._id}`)}
                                    sx={{ cursor: "pointer" }}
                                >
                                    <Box display="flex" alignItems="center" gap="1rem">
                                        <UserImage image={friend.picturePath} size="45px" />
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: "bold", color: palette.neutral.main }}>
                                                {friend.firstName} {friend.lastName}
                                            </Typography>
                                            <Typography variant="body2" color={palette.neutral.medium}>
                                                {friend.occupation}
                                            </Typography>
                                            <Typography variant="body2" color={palette.neutral.light}>
                                                {friend.mutualFriends || 0} mutual friends
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFriend(friend._id);
                                        }}
                                        sx={{
                                            background: 'linear-gradient(310deg, #FF0080 0%, #7928CA 100%)',
                                            color: 'white',
                                            '&:hover': {
                                                background: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
                                            },
                                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                            borderRadius: "8px",
                                            padding: '0.5rem 1.5rem',
                                        }}
                                    >
                                        Remove Friend
                                    </Button>
                                </Box>
                            </Paper>
                        </motion.div>
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
