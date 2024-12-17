import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import UserImage from "components/UserImage";
import { motion } from "framer-motion";
import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // Import warning icon
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useTheme } from "@mui/material/styles";


const FriendListWidget = ({ userId }) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.user.friends || []);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const theme = useTheme();

    // Fetch Friends
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

    // Confirm Friend Removal
    const handleRemoveFriend = (friend) => {
        setSelectedFriend(friend);
        setDialogOpen(true);
    };

    // Remove Friend Function
    const removeFriend = async () => {
        try {
            const response = await fetch(`http://localhost:3001/users/${userId}/friends/${selectedFriend._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                dispatch(setFriends({ friends: friends.filter(f => f._id !== selectedFriend._id) }));
                setDialogOpen(false);
                setSelectedFriend(null);
            } else {
                console.error("Failed to remove friend");
            }
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    };

    return (
<Box
  display="flex"
  flexDirection="column"
  gap="1.25rem"
  maxHeight="400px" // Chiều cao tối đa
  overflowY="auto" // Thanh cuộn
  sx={{
    "&::-webkit-scrollbar": { width: "8px" },
    "&::-webkit-scrollbar-thumb": { backgroundColor: "#888", borderRadius: "10px" },
    "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#555" },
    padding: "0 0.5rem",
  }}
>
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
                                elevation={2} 
                                onClick={() => navigate(`/profile/${friend._id}`)}
                                sx={{ 
                                    padding: '0.4rem', 
                                     cursor: "pointer",        
                                    borderRadius: "0.5rem", 
                                    background: palette.background.default,
                                    "&:hover": { 
                                        background: palette.background.paper,
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)"
                                    },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box 
                                    display="flex" 
                                    alignItems="center" 
                                >
                                    <UserImage image={friend.picturePath} size="50px" />
                                    <Box ml={2}>
                                        <Typography variant="h6" sx={{ fontWeight: "bold", color: palette.neutral.main }}>
                                            {friend.firstName} {friend.lastName}
                                        </Typography>
                                        <Typography variant="body2" color={palette.neutral.medium}>
                                            {friend.occupation}
                                        </Typography>
                                        <Typography variant="body2" color={palette.neutral.medium}>
                                            {friend.mutualFriends || 0} mutual friends
                                        </Typography>
                                    </Box>
                                </Box>
                                <Tooltip title="Remove Friend" placement="top">
                                    <Button
                                        variant="contained"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveFriend(friend);
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
                                        Remove
                                    </Button>
                                </Tooltip>
                            </Paper>
                        </motion.div>
                    ))
                ) : (
                    <Typography color={palette.neutral.medium} sx={{ textAlign: "center", fontStyle: "italic" }}>
                        No friends to display.
                    </Typography>
                )}
            </Box>

            <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                sx: {
                    borderRadius: "12px",
                    padding: "1rem",
                    background: theme.palette.background.paper,
                    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)"
                }
            }}
        >
            <DialogTitle
                id="alert-dialog-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    mb: 1
                }}
            >
                <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
                Confirm Friend Removal
            </DialogTitle>
            
            <DialogContent>
                <Typography
                    sx={{ fontSize: "1rem", color: theme.palette.text.secondary, mb: 2 }}
                >
                    Are you sure you want to remove{" "}
                    <Typography component="span" fontWeight="bold">
                        {selectedFriend?.firstName} {selectedFriend?.lastName}
                    </Typography>{" "}
                    from your friends list?
                </Typography>
            </DialogContent>
            
            <DialogActions sx={{ justifyContent: "space-between", mt: 1 }}>
                <Button
                    onClick={() => setDialogOpen(false)}
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    sx={{
                        fontWeight: "bold",
                        color: theme.palette.error.main,
                        borderColor: theme.palette.error.main,
                        "&:hover": {
                            backgroundColor: theme.palette.error.light,
                            borderColor: theme.palette.error.main
                        }
                    }}
                >
                    Cancel
                </Button>

                <Button
                    onClick={removeFriend}
                    variant="contained"
                    startIcon={<CheckIcon />}
                    sx={{
                        fontWeight: "bold",
                        color: "#fff",
                        backgroundColor: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                        "&:hover": {
                            backgroundColor: "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)",
                        },
                    }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
        </Box>
    );
};

export default FriendListWidget;
