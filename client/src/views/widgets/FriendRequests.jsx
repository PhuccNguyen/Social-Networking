import { Box, Typography, Button, Avatar, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const FriendRequests = ({ userId }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    const token = useSelector((state) => state.token);
    const theme = useTheme();
    const { palette } = theme;
    const main = palette.neutral.main;

    // Fetch the friend requests for the current user
    const fetchFriendRequests = async () => {
        try {
            const response = await fetch(`http://localhost:3001/friends/${userId}/requests`, {
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
        }
    };

    // Accept friend request
    const handleAcceptRequest = async (requesterId) => {
        try {
            const response = await fetch(`http://localhost:3001/friends/accept-request`, {
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
            const response = await fetch(`http://localhost:3001/friends/reject-request`, {
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
            <Typography variant="h5" fontWeight="bold" color={main} mb="1rem">
                Friend Requests
            </Typography>
            {friendRequests.length === 0 ? (
                <Typography>No pending friend requests.</Typography>
            ) : (
                friendRequests.map((request) => (
                    <Box
                        key={request._id}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb="1rem"
                        p="0.5rem"
                        border="1px solid"
                        borderColor={palette.divider}
                        borderRadius="8px"
                    >
                        <Box display="flex" alignItems="center" gap="1rem">
                            <Avatar src={request.picturePath} alt={request.firstName} />
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
                                color="primary"
                                onClick={() => handleAcceptRequest(request._id)}
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
                ))
            )}
        </Box>
    );
};

export default FriendRequests;
