import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const UserAbout = ({ userId }) => {
  const [user, setUser] = useState({ intro: "" });
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [introData, setIntroData] = useState("");
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
        setIntroData(data.intro || "");
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
      console.log("Intro updated successfully:", updatedUser);
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
        User Introduction
      </Typography>

      {error && (
        <Typography variant="body2" color="error" mb="1rem">
          {error}
        </Typography>
      )}

      <Typography
        variant="body1"
        color={palette.neutral.dark}
        sx={{ textAlign: "justify" }} // Căn đều hai bên
      >
        {user.intro || "No intro available."}
      </Typography>

      {/* Show edit button only if the logged-in user is viewing their own profile */}
      {loggedInUserId === userId && (
        <Button
          variant="contained"
          sx={{
            mt: 2,
            padding: "0.2rem 1rem",
            background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
            color: "#fff", // Ensure text is visible on gradient
            fontWeight: "bold", // Improve font weight
            fontSize: "1rem", // Make text slightly larger
            borderRadius: "8px", // Smooth border radius for a modern look
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
            transition: "transform 0.2s, opacity 0.2s", // Add smooth transitions
            "&:hover": {
              opacity: 0.9, // Slight dimming on hover
              transform: "scale(1.05)", // Slightly enlarge on hover
            },
            "&:active": {
              transform: "scale(0.98)", // Subtle press effect
            },
          }}
          onClick={handleOpenDialog}
        >
          Update Intro
        </Button>
      )}

<Dialog
  open={openDialog}
  onClose={handleCloseDialog}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: "16px",
      padding: "1.5rem",
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)", // Elevation effect
      background: "#f7f9fc", // Light background for better readability
    },
  }}
>
  <DialogTitle
    sx={{
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "1.8rem",
      color: "#444", // Neutral color for text
    }}
  >
    ✍️ Edit Your Intro
  </DialogTitle>
  <DialogContent>
    <Typography
      sx={{
        textAlign: "center",
        fontSize: "1rem",
        color: "#666", // Subtle hint text
        marginBottom: "1rem",
      }}
    >
      Share a little about yourself to let others know you better!
    </Typography>
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <TextField
        label="Intro"
        name="intro"
        value={introData}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={6} // Optimized for usability
        placeholder="Write something about yourself..."
        required
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: "12px",
            background: "#fff", // White input background for clarity
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for input
          },
          "& .MuiInputLabel-root": {
            fontSize: "1rem",
            color: "#888", // Neutral label color
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{
          mt: 2,
          padding: "0.75rem 2rem",
          background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1rem",
          borderRadius: "8px",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)", // Button elevation
          textTransform: "none",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)", // Hover scaling effect
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)", // Intense shadow
          },
        }}
      >
        Save Changes
      </Button>
    </Box>
  </DialogContent>
  <DialogActions
    sx={{
      justifyContent: "center", // Center alignment for Cancel button
      marginTop: "1rem",
    }}
  >
    <Button
      onClick={handleCloseDialog}
      sx={{
        padding: "0.5rem 2rem",
        color: "#7928CA",
        fontWeight: "bold",
        textTransform: "none",
        borderRadius: "8px",
        "&:hover": {
          color: "#FF0080", // Hover color transition
          textDecoration: "underline", // Subtle hover feedback
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

export default UserAbout;
