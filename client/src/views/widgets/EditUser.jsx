import { Box, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, useTheme } from "@mui/material";
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const EditUser = ({ userId }) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    status: '',
    location: '',
    occupation: ''
  });
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const loggedInUserId = useSelector((state) => state.user._id); // ID of logged-in user
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const navigate = useNavigate();

  // Fetch user data from the server
  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      setError("Could not load user information");
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]);

  // Handle form submit for updating user information
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to update user information");
      }

      const updatedUser = await response.json();
      console.log('User updated successfully:', updatedUser);
      
      setOpenDialog(false);
      navigate(`/profile/${userId}`);
    } catch (error) {
      setError("Failed to update user information");
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Open and close dialog for editing
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (loading) {
    return <Typography>Loading user information...</Typography>;
  }

  if (!user) {
    return <Typography>Error: User data could not be loaded.</Typography>;
  }

  const { firstName, lastName, status, location, occupation } = user;

  return (
    <Box
      sx={{
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
        backgroundColor: palette.background.paper,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" color={palette.neutral.dark} mb="2rem">
        User Information
      </Typography>
      
      {error && (
        <Typography variant="body2" color="error" mb="1rem">
          {error}
        </Typography>
      )}

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={12}>
          <Box display="flex" alignItems="center">
            <Typography variant="body1" color={palette.neutral.dark} fontWeight="bold" sx={{ minWidth: '150px' }}>
              First Name:
            </Typography>
            <Typography variant="body1" color={palette.neutral.dark}>
              {firstName || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box display="flex" alignItems="center">
            <Typography variant="body1" color={palette.neutral.dark} fontWeight="bold" sx={{ minWidth: '150px' }}>
              Last Name:
            </Typography>
            <Typography variant="body1" color={palette.neutral.dark}>
              {lastName || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box display="flex" alignItems="center">
            <Typography variant="body1" color={palette.neutral.dark} fontWeight="bold" sx={{ minWidth: '150px' }}>
              Status:
            </Typography>
            <Typography variant="body1" color={palette.neutral.dark}>
              {status || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box display="flex" alignItems="center">
            <Typography variant="body1" color={palette.neutral.dark} fontWeight="bold" sx={{ minWidth: '150px' }}>
              Location:
            </Typography>
            <Typography variant="body1" color={palette.neutral.dark}>
              {location || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box display="flex" alignItems="center">
            <Typography variant="body1" color={palette.neutral.dark} fontWeight="bold" sx={{ minWidth: '150px' }}>
              Occupation:
            </Typography>
            <Typography variant="body1" color={palette.neutral.dark}>
              {occupation || 'N/A'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Show edit button only if the logged-in user is viewing their own profile */}
      {loggedInUserId === userId && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleOpenDialog}
        >
          Edit Information
        </Button>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit User Information</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="First Name"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Location"
              name="location"
              value={user.location}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Status"
              name="status"
              value={user.status}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Occupation"
              name="occupation"
              value={user.occupation}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              Save Changes
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditUser;
