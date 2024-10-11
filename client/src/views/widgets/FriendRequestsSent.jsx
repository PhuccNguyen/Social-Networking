// src/views/widgets/FriendRequestsSent.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import Loader from "components/Loader";
import UserImage from "components/UserImage";
import { motion } from 'framer-motion'; // Import framer-motion for animations

const FriendRequestsSent = ({ userId }) => {
    const [sentRequests, setSentRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const { palette } = theme;
    const token = useSelector((state) => state.token);
    const baseUrl = 'http://localhost:3001';

    // Fetch the friend requests sent by the user
    const fetchSentRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/friends/${userId}/sent-requests`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            console.log('Fetched sentRequests:', data); // Log the data to inspect its structure

            // Ensure that the response is an array before setting it to the state
            setSentRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch sent requests:', error);
            setSentRequests([]); // Set to an empty array on failure
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSentRequests();
    }, [userId]);

    // Function to cancel a friend request
    const cancelFriendRequest = async (targetUserId) => {
        try {
            await fetch(`${baseUrl}/friends/cancel-request`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, targetUserId }),
            });
            // Remove the canceled request from the state
            setSentRequests(sentRequests.filter((request) => request._id !== targetUserId));
        } catch (error) {
            console.error('Failed to cancel friend request:', error);
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
                Friend Requests Sent
            </Typography>
            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="50vh" // Center the loader
                >
                    <Loader />
                </Box>
            ) : (
                sentRequests.length === 0 ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="50vh" // Center the message
                    >
                        <Typography variant="h6" color="textSecondary">
                            No pending friend requests sent.
                        </Typography>
                    </Box>
                ) : (
                    sentRequests.map((user) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }} // Animation on hover
                            whileTap={{ scale: 0.98 }} // Animation on click
                            transition={{ duration: 0.3 }}
                        >
                            <Paper
                                elevation={2}
                                sx={{
                                    marginBottom: '1rem',
                                    padding: '0.7rem',
                                    cursor: 'pointer', // Change cursor to pointer
                                    transition: 'box-shadow 0.3s',
                                    '&:hover': {
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                                    },
                                }}
                            >
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box display="flex" alignItems="center" gap="1rem">
                                        <UserImage image={user.picturePath} size="45px" />
                                        <Box>
                                            <Typography variant="body1" fontWeight="bold">
                                                {user.firstName} {user.lastName}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => cancelFriendRequest(user._id)}
                                        sx={{
                                            background: theme.palette.mode === 'dark'
                                                ? 'linear-gradient(310deg, #FF0080 0%, #7928CA 100%)'
                                                : 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
                                            color: 'white',
                                            '&:hover': {
                                                background: theme.palette.mode === 'dark'
                                                    ? 'linear-gradient(310deg, #FF0080 0%, #7928CA 100%)'
                                                    : 'linear-gradient(310deg, #FF0080 0%, #7928CA 100%)',
                                            },
                                        }}
                                    >
                                        Cancel Request
                                    </Button>
                                </Box>
                            </Paper>
                        </motion.div>
                    ))
                )
            )}
        </Box>
    );
};

export default FriendRequestsSent;
