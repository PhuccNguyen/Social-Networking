// src/views/widgets/FriendRequestsSent.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

const FriendRequestsSent = ({ userId }) => {
    const [sentRequests, setSentRequests] = useState([]);
    const theme = useTheme();
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const main = theme.palette.neutral.main; // Extract `main` from the theme

    // Fetch the friend requests sent by the user
    const fetchSentRequests = async () => {
        try {
            const response = await fetch(`http://localhost:3001/friends/${userId}/sent-requests`, {
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
        }
    };
    

    useEffect(() => {
        fetchSentRequests();
    }, [userId]);

    // Function to cancel a friend request
    const cancelFriendRequest = async (targetUserId) => {
        try {
            await fetch(`http://localhost:3001/friends/cancel-request`, {
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

    if (sentRequests.length === 0) {
        return (
            <Box padding="1rem">
                <Typography variant="h6" color="textSecondary">
                    No pending friend requests sent.
                </Typography>
            </Box>
        );
    }
    
    return (
        <Box>
            <Typography
                color={palette.neutral.dark}
                variant="h4"  // Increased font size for better hierarchy
                fontWeight="600"  // Bolder font for title
                sx={{
                    mb: "1.5rem",
                    textAlign: 'center',  // Center align the title for better UI balance
                    textTransform: 'uppercase',  // Add uppercase style for a modern look
                    letterSpacing: '1.5px',  // Slight letter spacing for improved readability
                }}
            >
                Friend Requests Sent
            </Typography>
            {sentRequests.map((user) => (
                <Paper key={user._id} elevation={2} sx={{ marginBottom: '1rem', padding: '1rem' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                            {user.firstName} {user.lastName}
                        </Typography>
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
                                        ? 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)'
                                        : 'linear-gradient(310deg, #FF0080 0%, #7928CA 100%)',
                                },
                            }}
                        >
                            Cancel Request
                        </Button>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default FriendRequestsSent;
