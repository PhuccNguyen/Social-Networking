// src/views/widgets/FriendSuggestions.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Avatar } from '@mui/material';
import { useSelector } from 'react-redux';

const FriendSuggestions = ({ userId }) => {
    const [suggestions, setSuggestions] = useState([]);
    const token = useSelector((state) => state.token);

    // Fetch the friend suggestions
    const fetchSuggestions = async () => {
        try {
            const response = await fetch(`http://localhost:3001/friends/${userId}/suggestions`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Failed to fetch friend suggestions:', error);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, [userId]);

    // Function to send a friend request
    const sendFriendRequest = async (targetUserId) => {
        try {
            await fetch(`http://localhost:3001/friends/send-request`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, targetUserId }),
            });
            // Remove the user from the suggestions after sending a request
            setSuggestions(suggestions.filter((suggestion) => suggestion._id !== targetUserId));
        } catch (error) {
            console.error('Failed to send friend request:', error);
        }
    };

    if (suggestions.length === 0) {
        return (
            <Box padding="1rem">
                <Typography variant="h6" color="textSecondary">
                    No friend suggestions available.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography
                variant="h4"
                fontWeight="600"
                sx={{
                    mb: "1.5rem",
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                }}
            >
                Friend Suggestions
            </Typography>
            {suggestions.map((user) => (
                <Paper key={user._id} elevation={2} sx={{ marginBottom: '1rem', padding: '1rem' }}>
                    <Box display="flex" alignItems="center" gap="1rem">
                        <Avatar src={user.picturePath} alt={`${user.firstName} ${user.lastName}`} />
                        <Box flex="1">
                            <Typography variant="h6">
                                {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {user.occupation}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => sendFriendRequest(user._id)}
                        >
                            Add Friend
                        </Button>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default FriendSuggestions;
