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
  Select,
  MenuItem,
  FormControl, // Ensure this is correctly imported
  InputLabel,
  useTheme,
} from "@mui/material";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const EditUser = ({ userId }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    status: "",
    location: "",
    occupation: "",
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
      console.log("User updated successfully:", updatedUser);

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
            <Typography
              variant="body1"
              color={palette.neutral.dark}
              fontWeight="bold"
              sx={{ minWidth: "150px" }}
            >
              First Name:
            </Typography>
            <Typography variant="body1" color={palette.neutral.dark}>
              {firstName || "N/A"}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              color={palette.neutral.dark}
              fontWeight="bold"
              sx={{ minWidth: "150px" }}
            >
              Last Name:
            </Typography>
            <Typography variant="body1" color={palette.neutral.dark}>
              {lastName || "N/A"}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={12}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              color={palette.neutral.dark}
              fontWeight="bold"
              sx={{ minWidth: "150px" }}
            >
              Status:
            </Typography>
            <Typography variant="body1" color={palette.neutral.dark}>
              {status || "N/A"}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={12}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              color={palette.neutral.dark}
              fontWeight="bold"
              sx={{ minWidth: "150px" }}
            >
              Location:
            </Typography>
            <Typography variant="body1" color={palette.neutral.dark}>
              {location || "N/A"}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              color={palette.neutral.dark}
              fontWeight="bold"
              sx={{ minWidth: "150px" }}
            >
              Occupation:
            </Typography>
            <Typography variant="body1" color={palette.neutral.dark}>
              {occupation || "N/A"}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Show edit button only if the logged-in user is viewing their own profile */}
      {loggedInUserId === userId && (
        <Button
          variant="contained"
          sx={{
            mt: 3,
            padding: "0.35rem 1rem", // Increased padding for better touch experience
            background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)", // Eye-catching gradient
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1rem", // Slightly larger font for readability
            borderRadius: "8px", // Rounded corners for a modern look
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)", // Subtle shadow for elevation
            textTransform: "none", // Avoids uppercase transformation for better readability
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)", // Hover effect for engagement
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)", // Enhanced shadow on hover
              background: "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)", // Reverse gradient on hover
            },
          }}
          onClick={handleOpenDialog}
        >
          🛠️ Edit Information
        </Button>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            padding: "1.5rem",
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "#7928CA",
            marginBottom: "1rem",
          }}
        >
          Edit User Information
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <TextField
              label="First Name"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              variant="outlined"
              InputProps={{
                sx: { borderRadius: "8px" },
              }}
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              variant="outlined"
              InputProps={{
                sx: { borderRadius: "8px" },
              }}
            />
            <TextField
              label="Location"
              name="location"
              value={user.location}
              onChange={handleChange}
              fullWidth
              margin="dense"
              variant="outlined"
              InputProps={{
                sx: { borderRadius: "8px" },
              }}
            />
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel>Relationship Status</InputLabel>
              <Select
                name="status"
                value={user.status}
                onChange={handleChange}
                label="Relationship Status"
                sx={{
                  borderRadius: "8px", // Rounded corners
                  padding: "0.5rem", // Improved padding
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderRadius: "8px", // Round the border corners
                    },
                  },
                }}
              >
                <MenuItem value="single">Single</MenuItem>
                <MenuItem value="married">Married</MenuItem>
                <MenuItem value="divorced">Divorced</MenuItem>
                <MenuItem value="in a relationship">In a Relationship</MenuItem>
                <MenuItem value="Complex relationship">Complex relationship</MenuItem>

              </Select>
            </FormControl>

            <TextField
              label="Occupation"
              name="occupation"
              value={user.occupation}
              onChange={handleChange}
              fullWidth
              margin="dense"
              variant="outlined"
              InputProps={{
                sx: { borderRadius: "8px" },
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
                textTransform: "none",
                borderRadius: "8px",
                "&:hover": {
                  background:
                    "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)",
                  opacity: 0.9,
                },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            padding: "1rem",
            gap: "1rem",
          }}
        >
          <Button
            onClick={handleCloseDialog}
            sx={{
              padding: "0.5rem 1.5rem",
              textTransform: "none",
              color: "#7928CA",
              fontWeight: "bold",
              borderRadius: "8px",
              "&:hover": {
                background: "rgba(121, 40, 202, 0.1)",
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

export default EditUser;
