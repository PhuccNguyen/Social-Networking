import { Box, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, useTheme } from "@mui/material";
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const UserSecurity = ({ userId }) => {
  const [user, setUser] = useState({ email: '', mobile: '' });
  const [error, setError] = useState(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [showOldPassword, setShowOldPassword] = useState(false); // State for toggling old password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // State for toggling new password visibility
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

  // Handle input change for Email/Mobile fields
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle Password Change
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
        if (response.status === 400 && errorData.message === "Current password is incorrect") {
          alert("The current password you entered is incorrect. Please try again.");
        } else {
          throw new Error(errorData.message || "Failed to change password");
        }
        return; 
      }

      setOpenPasswordDialog(false);
      alert('Password changed successfully');
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
      console.log('Email/Mobile updated successfully:', updatedUser);
      setOpenEmailDialog(false);
      alert('Email/Mobile updated successfully');
    } catch (error) {
      setError("Failed to update contact information");
    }
  };

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
    <Box sx={{ padding: "2rem", borderRadius: "12px", boxShadow: "0px 10px 30px rgba(0,0,0,0.1)", backgroundColor: palette.background.paper, textAlign: "center" }}>
      <Typography variant="h5" color={palette.neutral.dark} mb="2rem">Security Information</Typography>

      {error && (
        <Typography variant="body2" color="error" mb="1rem">{error}</Typography>
      )}

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" color={palette.neutral.dark}>Password</Typography>
            <Button variant="outlined" color="primary" onClick={handleOpenPasswordDialog}>Change Password</Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" color={palette.neutral.dark}>Email</Typography>
            <Typography variant="body1" color={palette.neutral.dark}>{email}</Typography>
            <Button variant="outlined" color="primary" onClick={handleOpenEmailDialog}>Edit</Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" color={palette.neutral.dark}>Mobile</Typography>
            <Typography variant="body1" color={palette.neutral.dark}>{mobile}</Typography>
            <Button variant="outlined" color="primary" onClick={handleOpenEmailDialog}>Edit</Button>
          </Box>
        </Grid>
      </Grid>

      {/* Dialog for Changing Password */}
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handlePasswordSubmit}>
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
                )
              }}
            />
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
                )
              }}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>Change Password</Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog} color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Editing Email/Mobile */}
      <Dialog open={openEmailDialog} onClose={handleCloseEmailDialog}>
        <DialogTitle>Edit Contact Information</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleEmailMobileSubmit}>
            <TextField label="Email" name="email" value={user.email} onChange={handleChange} fullWidth margin="normal" required />
            <TextField label="Mobile" name="mobile" value={user.mobile} onChange={handleChange} fullWidth margin="normal" required />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>Save Changes</Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmailDialog} color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserSecurity;
