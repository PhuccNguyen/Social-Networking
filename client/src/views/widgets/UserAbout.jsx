import { Box, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, useTheme } from "@mui/material";
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

const UserAbout = ({ userId }) => {
  const [user, setUser] = useState({ intro: '' });
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [introData, setIntroData] = useState('');
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id); 
  const { palette } = useTheme();

  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIntroData(data.intro || ''); 
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

  // Handle form submit for updating intro information
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ intro: introData }),
      });

      if (!response.ok) {
        throw new Error("Failed to update intro");
      }

      const updatedUser = await response.json();
      console.log('Intro updated successfully:', updatedUser);
      setUser(updatedUser);
      setOpenDialog(false);
    } catch (error) {
      setError("Failed to update intro");
    }
  };

  const handleChange = (e) => {
    setIntroData(e.target.value);
  };

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
        User Intro
      </Typography>
      
      {error && (
        <Typography variant="body2" color="error" mb="1rem">
          {error}
        </Typography>
      )}

      <Typography
        variant="body1"
        color={palette.neutral.dark}
        sx={{ textAlign: 'justify' }} // Căn đều hai bên
      >
        {user.intro || 'No intro available.'}
      </Typography>

      {/* Show edit button only if the logged-in user is viewing their own profile */}
      {loggedInUserId === userId && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleOpenDialog}
        >
          Update Intro
        </Button>
      )}

      {/* Dialog for editing intro */}
{/* Dialog for editing intro */}
<Dialog 
  open={openDialog} 
  onClose={handleCloseDialog} 
  maxWidth="md"  
  fullWidth  
>
  <DialogTitle>Edit Intro</DialogTitle>
  <DialogContent>
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Intro"
        name="intro"
        value={introData}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={9} // Allow multiple lines for intro
        required
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

export default UserAbout;
