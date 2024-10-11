// src/views/widgets/FriendRequests.jsx
import { Box, Typography, Button, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from 'components/Loader';
import UserImage from 'components/UserImage';
import { motion } from 'framer-motion'; // Import framer-motion for animations

const FriendRequests = ({ userId }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = useSelector((state) => state.token);
    const theme = useTheme();
    const { palette } = theme;
    const navigate = useNavigate(); // Use navigate for routing

    // Base URL for fetching data
    const baseUrl = 'http://localhost:3001';

    // Fetch the friend requests for the current user
    const fetchFriendRequests = async () => {
        try {
            const response = await fetch(`${baseUrl}/friends/${userId}/requests`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setFriendRequests(data);
            } else {
                console.error('Failed to fetch friend requests');
            }
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        } finally {
            setLoading(false);
        }
    };

    // Accept friend request
    const handleAcceptRequest = async (requesterId) => {
        try {
            const response = await fetch(`${baseUrl}/friends/accept-request`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, requesterId }),
            });

            if (response.ok) {
                // Remove the accepted request from the list
                setFriendRequests(friendRequests.filter(request => request._id !== requesterId));
                console.log('Friend request accepted');
            } else {
                console.error('Failed to accept friend request');
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    // Reject friend request
    const handleRejectRequest = async (requesterId) => {
        try {
            const response = await fetch(`${baseUrl}/friends/reject-request`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, requesterId }),
            });

            if (response.ok) {
                // Remove the rejected request from the list
                setFriendRequests(friendRequests.filter(request => request._id !== requesterId));
                console.log('Friend request rejected');
            } else {
                console.error('Failed to reject friend request');
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    useEffect(() => {
        fetchFriendRequests();
    }, []); // Fetch on component mount

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
                Friend Requests
            </Typography>
            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="50vh" // Adjust the height to center the loader vertically
                >
                    <Loader /> {/* Show the loader while data is loading */}
                </Box>
            ) : (
                friendRequests.length === 0 ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="50vh" // Adjust the height to center the message
                    >
                        <Typography>No pending friend requests.</Typography>
                    </Box>
                ) : (
                    friendRequests.map((request) => (
                        <motion.div
                            key={request._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                mb="1rem"
                                p="0.5rem"
                                border="1px solid"
                                borderColor={palette.divider}
                                borderRadius="8px"
                                sx={{
                                    transition: "box-shadow 0.3s",
                                    "&:hover": {
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)"
                                    }
                                }}
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap="1rem"
                                    onClick={() => navigate(`/profile/${request._id}`)} // Navigate to user's profile
                                    sx={{ cursor: "pointer" }}
                                >
                                    <UserImage image={request.picturePath} size="45px" />
                                    <Box>
                                        <Typography variant="body1" fontWeight="bold">
                                            {request.firstName} {request.lastName}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {request.email}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" gap="0.5rem">
                                <Button
                                variant="contained"
                                    color="error"
                                    onClick={() => handleAcceptRequest(request._id)}
                                    sx={{
                                        background: theme.palette.mode === 'dark'
                                            ? 'linear-gradient(310deg, #FF0080 0%, #7928CA 100%)'
                                            : 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
                                        color: 'white',
                                        '&:hover': {
                                            background: theme.palette.mode === 'dark'
                                                ? 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)'
                                                : 'linear-gradient(310deg, #FF0080 0%, #7928CA 100%)',
                                        },
                                    }}
                                >
                                Accept
                                </Button>

                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleRejectRequest(request._id)}
                                    >
                                        Reject
                                    </Button>
                                </Box>
                            </Box>
                        </motion.div>
                    ))
                )
            )}
        </Box>
    );
};

export default FriendRequests;
