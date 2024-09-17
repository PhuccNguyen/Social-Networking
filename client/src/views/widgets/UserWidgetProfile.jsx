import { ManageAccountsOutlined } from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import React from 'react';
import UserImageProfile from "components/UserImageProfile";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const UserWidgetProfile = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.primary.main;

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

  const { firstName, lastName, status, email, location, occupation, friends } = user;

  return (
    <Box>
      <WidgetWrapper
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
              backgroundSize: "cover", // Ensures the image covers the entire area
              backgroundPosition: "center", // Centers the image
              borderRadius: "12px 12px 0 0",
              overflow: "hidden",
            }}
          />

          <Box
            position="absolute"
            top="40%"
            zIndex="100000"
            left="16%"
          >
            <UserImageProfile
              image={picturePath}
              size="90px"
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

        {/* Horizontal Information Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="column"
          mb="1rem"
        >
          {/* Information Row */}
          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center" width="200px">
              <ManageAccountsOutlined sx={{ mr: "0.5rem", color: main }} />
              <Typography fontWeight="600" color={main} width="80px" textAlign="left">
                Location
              </Typography>
            </Box>
            <Typography fontSize="1rem" color={medium} textAlign="left" width="300px">
              {location}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center" width="200px">
              <ManageAccountsOutlined sx={{ mr: "0.5rem", color: main }} />
              <Typography fontWeight="600" color={main} width="80px" textAlign="left">
                Email
              </Typography>
            </Box>
            <Typography fontSize="1rem" color={medium} textAlign="left" width="300px">
              {email}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center" width="200px">
              <ManageAccountsOutlined sx={{ mr: "0.5rem", color: main }} />
              <Typography fontWeight="600" color={main} width="80px" textAlign="left">
                Friends
              </Typography>
            </Box>
            <Typography fontSize="1rem" color={medium} textAlign="left" width="300px">
              {friends.length} Friends
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center" width="200px">
              <ManageAccountsOutlined sx={{ mr: "0.5rem", color: main }} />
              <Typography fontWeight="600" color={main} width="80px" textAlign="left">
                Status
              </Typography>
            </Box>
            <Typography fontSize="1rem" color={medium} textAlign="left" width="300px">
              {status || "No status available"}
            </Typography>
          </Box>
        </Box>
      </WidgetWrapper>
    </Box>
  );
};

export default UserWidgetProfile;
