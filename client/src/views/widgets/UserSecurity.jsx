import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { MailOutline, Phone } from '@mui/icons-material';
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const UserSecurity = ({ userId }) => {
  const [user, setUser] = useState({ email: "", mobile: "" });
  const [error, setError] = useState(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const loggedInUserId = useSelector((state) => state.user._id);
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();

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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check if the error is due to incorrect old password
        if (
          response.status === 400 &&
          errorData.message === "Current password is incorrect"
        ) {
          alert(
            "The current password you entered is incorrect. Please try again."
          );
        } else {
          throw new Error(errorData.message || "Failed to change password");
        }
        return;
      }

      setOpenPasswordDialog(false);
      alert("Password changed successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle Email/Mobile Change
  const handleEmailMobileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email, mobile: user.mobile }),
      });

      if (!response.ok) {
        throw new Error("Failed to update contact information");
      }

      const updatedUser = await response.json();
      console.log("Email/Mobile updated successfully:", updatedUser);
      setOpenEmailDialog(false);
      alert("Email/Mobile updated successfully");
    } catch (error) {
      setError("Failed to update contact information");
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1; // Length
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase letter
    if (/[a-z]/.test(password)) strength += 1; // Lowercase letter
    if (/[0-9]/.test(password)) strength += 1; // Number
    if (/[!@#$%^&*()_+{}\[\]:;"'<>,.?\/\\|]/.test(password)) strength += 1; // Special characters
    return (strength / 5) * 100; // Convert to percentage
  };
  
  
    // Determine the color of the progress bar based on password strength
    const passwordStrength = calculatePasswordStrength(passwordData.newPassword);
    let progressColor = 'error'; // Default to red
    if (passwordStrength >= 60) progressColor = 'warning'; // Yellow
    if (passwordStrength >= 80) progressColor = 'success'; // Green

  const handleOpenPasswordDialog = () => setOpenPasswordDialog(true);
  const handleClosePasswordDialog = () => setOpenPasswordDialog(false);

  const handleOpenEmailDialog = () => setOpenEmailDialog(true);
  const handleCloseEmailDialog = () => setOpenEmailDialog(false);

  const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);

  if (loading) {
    return <Typography>Loading user information...</Typography>;
  }

  if (!user) {
    return <Typography>Error: User data could not be loaded.</Typography>;
  }

  const { email, mobile } = user;

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
        Security Information
      </Typography>

      {error && (
        <Typography variant="body2" color="error" mb="1rem">
          {error}
        </Typography>
      )}

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              color={palette.neutral.dark}
            >
              Password
            </Typography>
            <Typography variant="body1" color={palette.neutral.dark}>
              *****************
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenPasswordDialog}
              sx={{
                zIndex: 1000,
                padding: "0.3rem 0.8rem", // Add padding for better text readability
                borderRadius: "4px", // Rounded corners for a modern look
                fontWeight: "bold", // Make the text bold for emphasis
                background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)", // Gradient background
                color: "white", // Text color
                border: "2px solid transparent", // Transparent border to let the gradient show through
                "&:hover": {
                  background:
                    "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)", // Inverted gradient on hover
                  borderColor: "#FF0080", // Border color change on hover
                  color: "#FFF", // Ensure the text stays white
                },
                "&:focus": {
                  outline: "none", // Remove default focus outline
                  boxShadow: "0 0 0 4px rgba(255, 0, 128, 0.4)", // Add a soft focus effect for accessibility
                },
                transition: "all 0.3s ease", // Smooth transition for hover/focus effects
              }}
            >
              Change Password
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              fontWeight="bold"
              variant="body1"
              color={palette.neutral.dark}
            >
              Email
            </Typography>
            <Typography variant="body1" color={palette.neutral.dark}>
              {email}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenEmailDialog}
              sx={{
                zIndex: 1000,
                borderRadius: "4px", // Rounded corners for a modern look
                fontWeight: "bold", // Make the text bold for emphasis
                background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)", // Gradient background
                color: "white", // Text color
                "&:hover": {
                  background:
                    "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)", // Inverted gradient on hover
                  borderColor: "#FF0080", // Border color change on hover
                  color: "#FFF", // Ensure the text stays white
                },
              }}
            >
              Edit
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              color={palette.neutral.dark}
            >
              Mobile
            </Typography>
            <Typography variant="body1" color={palette.neutral.dark}>
              {mobile}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenEmailDialog}
              sx={{
                zIndex: 1000,
                borderRadius: "4px", // Rounded corners for a modern look
                fontWeight: "bold", // Make the text bold for emphasis
                background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)", // Gradient background
                color: "white", // Text color
                "&:hover": {
                  background:
                    "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)", // Inverted gradient on hover
                  borderColor: "#FF0080", // Border color change on hover
                  color: "#FFF", // Ensure the text stays white
                },
              }}
            >
              Edit
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handlePasswordSubmit}>
          
          {/* Current Password */}
          <TextField
            label="Current Password"
            name="oldPassword"
            type={showOldPassword ? "text" : "password"}
            value={passwordData.oldPassword}
            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowOldPassword}>
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: "8px",
              '& .MuiInputBase-root': {
                borderRadius: "8px",
              },
            }}
          />

          {/* New Password */}
          <TextField
            label="New Password"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowNewPassword}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: "8px",
              '& .MuiInputBase-root': {
                borderRadius: "8px",
              },
            }}
          />

          {/* Password Strength Indicator */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              New Password Strength:
            </Typography>
            <LinearProgress
              variant="determinate"
              value={passwordStrength}
              sx={{
                height: 5,
                borderRadius: "5px",
                backgroundColor: progressColor === 'success' ? '#388e3c' : progressColor === 'warning' ? '#fbc02d' : '#d32f2f',
              }}
            />
          </Box>

          {/* Save and Cancel Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                fontWeight: "bold",
                background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)",
                },
              }}
            >
              Change Password
            </Button>

            <Button
              onClick={handleClosePasswordDialog}
              color="primary"
              sx={{
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                fontWeight: "bold",
                background: "#f5f5f5",
                "&:hover": {
                  background: "#e0e0e0",
                },
              }}
            >
              Cancel
            </Button>
          </Box>

        </Box>
      </DialogContent>
    </Dialog>
    
    <Dialog open={openEmailDialog} onClose={handleCloseEmailDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Contact Information</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleEmailMobileSubmit}>
          
          {/* Email Field */}
          <TextField
            label="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutline />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: '8px', // Rounded corners for inputs
              '& .MuiInputBase-root': {
                borderRadius: '8px',
              },
              '& .MuiInputLabel-root': {
                fontWeight: '500', // Bold label
              },
            }}
          />

          {/* Mobile Field */}
          <TextField
            label="Mobile"
            name="mobile"
            value={user.mobile}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: '8px', // Rounded corners for inputs
              '& .MuiInputBase-root': {
                borderRadius: '8px',
              },
              '& .MuiInputLabel-root': {
                fontWeight: '500', // Bold label
              },
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              padding: '0.75rem 1.5rem', // Increase padding for better touch targets
              borderRadius: '8px', // Rounded corners for the button
              fontWeight: 'bold', // Bold text
              background: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)', // Gradient background
              color: 'white', // White text color
              "&:hover": {
                background: 'linear-gradient(310deg, #FF0080 0%, #7928CA 100%)', // Hover effect
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </DialogContent>

      {/* Action Buttons */}
      <DialogActions>
        <Button
          onClick={handleCloseEmailDialog}
          color="secondary"
          sx={{
            fontWeight: 'bold',
            padding: '0.75rem 1.5rem', // Increase padding
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#f5f5f5', // Hover effect
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
    </Box>
  );
};

export default UserSecurity;
