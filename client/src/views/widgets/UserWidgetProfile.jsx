import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserImageProfile from "components/UserImageProfile";
import WidgetWrapper from "components/WidgetWrapper";
import { FcStackOfPhotos, FcAddressBook, FcBusinessman } from "react-icons/fc";
import CameraAltIcon from "@mui/icons-material/CameraAlt"; // Camera icon for image upload
import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert

const UserWidgetProfile = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const token = useSelector((state) => state.token);
  const [newPicture, setNewPicture] = useState(null);
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const loggedInUserId = useSelector((state) => state.user._id);
  const medium = palette.neutral.medium;
  const main = palette.primary.main;
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state

  // Fetch user data from the server
  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data);
    } else {
      console.error("Failed to fetch user data");
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]);

  if (!user) return null;

  const { firstName, lastName, status, email, location, occupation, friends } =
    user;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPicture(URL.createObjectURL(file)); // Preview the new image
      const formData = new FormData();
      formData.append("file", file);

      fetch(`http://localhost:3001/users/${userId}/updateProfilePic`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            getUser(); // Refresh user data
            setOpenSnackbar(true); // Show success alert
          } else {
            console.error("Failed to upload image");
          }
        })
        .catch((err) => console.error("Error uploading image:", err));
    }
  };

  const handleNavigateToFriendPage = () => {
    window.location.href = "http://localhost:3000/friendPage";
  }; // Navigate to the friend page

  return (
    <Box>
      <WidgetWrapper
        position="fixed"
        zIndex={100}
        sx={{
          padding: "1.5rem",
          borderRadius: "12px",
          backgroundColor: palette.background.paper,
          boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
          maxWidth: "370px",
          margin: "auto",
          textAlign: "center",
        }}
      >
        <Box margin="0 0 -20px 0">
          <Box
            sx={{
              position: "relative",
              height: "200px",
              backgroundImage: `url('/assets/background.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "12px 12px 0 0",
              overflow: "hidden",
            }}
          />

          <Box position="absolute" top="30%" zIndex="1000" left="38%">
            <UserImageProfile image={newPicture || picturePath} size="90px" />

            {loggedInUserId === userId && (
              <IconButton
                onClick={() =>
                  document.getElementById("profile-image-input").click()
                }
                sx={{
                  position: "absolute",
                  bottom: "5px",
                  right: "5px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  padding: "5px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                <CameraAltIcon sx={{ fontSize: "1.5rem", color: "#d62931" }} />
              </IconButton>
            )}
            {/* Hidden file input */}
            <input
              type="file"
              id="profile-image-input"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Box>

          <Box mt="52px">
            <Typography variant="h4" fontWeight="bold" color={dark} mb="0.5rem">
              {firstName} {lastName}
            </Typography>

            <Typography fontSize="1.1rem" color={medium} mb="1.5rem">
              {occupation}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: "1rem" }} />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="column"
          mb="1rem"
        >
          {/* Address Section */}
          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center" width="200px">
              {/* Replace SVG with Image */}
              <img
                src="/assets/circle.png"
                alt="Address Icon"
                style={{
                  width: "2rem", // Adjust the size as needed
                  height: "2rem",
                  objectFit: "contain", // Ensure the image scales properly
                }}
              />
              <Typography
                fontWeight="600"
                width="80px"
                textAlign="left"
                marginLeft="0.5rem"
              >
                Address
              </Typography>
            </Box>
            <Typography
              fontSize="1rem"
              color={medium}
              textAlign="left"
              width="300px"
              sx={{
                "&:hover": {
                  WebkitTextFillColor: "transparent",
                  background:
                    "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                  WebkitBackgroundClip: "text",
                  cursor: "pointer",
                },
              }}
            >
              {location}
            </Typography>
          </Box>

          {/* Email Section */}
          <Box display="flex"             mt="1rem"
 justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center" width="200px">
              {/* Replace FcAddressBook icon with an Image */}
              <img
                src="/assets/email.png"
                alt="Email Icon"
                style={{
                  width: "2rem", // Adjust the size as needed
                  height: "2rem",
                  objectFit: "contain", // Ensure the image scales appropriately
                }}
              />
              <Typography
                fontWeight="600"
                width="80px"
                textAlign="left"
                marginLeft="0.5rem"
              >
                Email
              </Typography>
            </Box>
            <Typography
              fontSize="1rem"
              color={medium}
              textAlign="left"
              width="300px"
              sx={{
                "&:hover": {
                  WebkitTextFillColor: "transparent",
                  background:
                    "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                  WebkitBackgroundClip: "text",
                  cursor: "pointer",
                },
              }}
            >
              {email}
            </Typography>
          </Box>

          {/* Friend Count Section */}
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            mt="1rem"
          >
            <Box display="flex" alignItems="center" width="200px">
              {/* Replace the SVG with an Image */}
              <img
                src="/assets/high-five.png" // Add the correct path to your icon image
                alt="Friend Icon"
                style={{
                  width: "2rem", // Adjust the size as needed
                  height: "2rem",
                  objectFit: "contain", // Ensure the image scales properly
                }}
              />
              <Typography
                fontWeight="600"
                width="80px"
                textAlign="left"
                marginLeft="0.5rem"
              >
                Friends
              </Typography>
            </Box>
            <Typography
              fontSize="1rem"
              role="button"
              onClick={handleNavigateToFriendPage}
              color={medium}
              textAlign="left"
              width="300px"
              sx={{
                "&:hover": {
                  WebkitTextFillColor: "transparent",
                  background:
                    "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                  WebkitBackgroundClip: "text",
                  cursor: "pointer",
                },
              }}
            >
              {friends.length} Friends
            </Typography>
          </Box>

          {/* Status Section */}
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            mt="1rem"
          >
            <Box display="flex" alignItems="center" width="200px">
              {/* Replace FcStackOfPhotos icon with Image */}
              <img
                src="/assets/status.jpg" // Replace with the correct path to your image
                alt="Status Icon"
                style={{
                  width: "2rem", // Adjust the size as needed
                  height: "2rem",
                  objectFit: "contain", // Ensure the image scales properly
                }}
              />
              <Typography
                fontWeight="600"
                width="80px"
                textAlign="left"
                marginLeft="0.5rem"
              >
                Status
              </Typography>
            </Box>
            <Typography
              fontSize="1rem"
              color={medium}
              textAlign="left"
              width="300px"
              sx={{
                "&:hover": {
                  WebkitTextFillColor: "transparent",
                  background:
                    "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                  WebkitBackgroundClip: "text",
                  cursor: "pointer",
                },
              }}
            >
              {status || "No status available"}
            </Typography>
          </Box>
        </Box>

        <dix
          style={{
            position: "absolute",
            top: "0px",
            bottom: "100px",
            left: "1130px",
            zIndex: 1000,
            width: "300px",
          }}
        >
          <Snackbar
            open={openSnackbar}
            position="absolute"
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              position: "absolute",
              top: "20px",
              right: "20px",
              zIndex: 1000,
              width: "300px",
            }}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity="success">
              Profile picture uploaded successfully!
            </Alert>
          </Snackbar>
        </dix>
      </WidgetWrapper>
    </Box>
  );
};

export default UserWidgetProfile;
