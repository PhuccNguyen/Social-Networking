import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Avatar, Snackbar, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from "components/Loader";
import { motion } from 'framer-motion';

const FriendSuggestions = ({ userId }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSnackbar, setShowSnackbar] = useState(false); // Snackbar state
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();

    // Fetch friend suggestions
    const fetchSuggestions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3001/friends/${userId}/suggestions`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Failed to fetch friend suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, [userId]);

    // Function to send friend request
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

            // Show success message and close it after 2 seconds
            setSnackbarMessage('Friend request sent!');
            setShowSnackbar(true);
            setTimeout(() => setShowSnackbar(false), 2000);

            // Remove user from suggestions after sending request
            setSuggestions(suggestions.filter((suggestion) => suggestion._id !== targetUserId));
        } catch (error) {
            console.error('Failed to send friend request:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <Loader />
            </Box>
        );
    }

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
                <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            marginBottom: '1rem',
                            padding: '0.5rem',
                            border: '0.2px solid gray',
                            cursor: 'pointer',
                            transition: 'box-shadow 0.3s',
                            '&:hover': { boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)' },
                        }}
                        onClick={() => navigate(`/profile/${user._id}`)}
                    >
                        <Box display="flex" alignItems="center" gap="0.5rem">
                            <Avatar
                                src={`http://localhost:3001/assets/${user.picturePath}`}
                                alt={`${user.firstName} ${user.lastName}`}
                                sx={{
                                    width: 50,
                                    height: 50,
                                    backgroundColor: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
                                }}
                            />
                            <Box flex="1">
                                <Typography variant="h6" fontWeight="bold">
                                    {user.firstName} {user.lastName}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {user.occupation}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent parent click event
                                    sendFriendRequest(user._id);
                                }}
                                sx={{
                                    background: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
                                    color: 'white',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '8px',
                                    '&:hover': {
                                        background: 'linear-gradient(310deg, #FF0080 0%, #7928CA 100%)',
                                    },
                                }}
                            >
                                Add Friend
                            </Button>
                        </Box>
                    </Paper>
                </motion.div>
            ))}

{/* Snackbar Alert */}
<Snackbar
    open={showSnackbar}
    autoHideDuration={6000}
    onClose={() => setShowSnackbar(false)}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    sx={{
        zIndex: 1500,
        padding: '0.5rem', // Add slight padding for spacing
    }}
>
    <Alert
        onClose={() => setShowSnackbar(false)}
        severity="success"
        sx={{
            width: '100%',
            color: 'white',
            fontWeight: 'bold',
            background: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)', // Gradient background
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Soft shadow for a floating effect
            borderRadius: '8px', // Rounded corners for smoother appearance
            padding: '0.5rem 1rem', // Add padding for better text spacing
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: '1rem',
        }}
    >
        {snackbarMessage}
    </Alert>
</Snackbar>

                
        </Box>
    );
};

export default FriendSuggestions;
