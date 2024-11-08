import { ManageAccountsOutlined } from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import React from "react";
import UserImageProfile from "components/UserImageProfile";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FcStackOfPhotos, FcAddressBook } from "react-icons/fc";

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

  const { firstName, lastName, status, email, location, occupation, friends } =
    user;

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
            <UserImageProfile image={picturePath} size="90px" />
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
          {/* Information Row */}
          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center" width="200px">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fontSize="1.5rem"
                width="1em"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#d62931"
                  d="M240.3 396.8c3.3 5.1 9.1 8.5 15.7 8.5s12.4-3.4 15.8-8.5L382 226.6c14.8-22.9 23.4-48.1 23.4-77.3C405.3 64.9 339 0
                   256 0S106.7 64.9 106.7 149.3c0 29.2 8.6 54.4 23.4 77.3zM256 64c47.1 0 85.3 38.2 85.3 85.3s-38.2 85.3-85.3 85.3s-85
                   .3-38.2-85.3-85.3S208.9 64 256 64m109.4 259.5L256 469.3L146.6 323.5c-37.4 19.6-61.3 48.9-61.3 81.8C85.3 464.2 161.
                   7 512 256 512s170.7-47.8 170.7-106.7c0-32.9-23.9-62.2-61.3-81.8"
                />
              </svg>
              <Typography
                fontWeight="600"
                width="80px"
                textAlign="left"
                marginLeft="0.5rem"
              >
                Adress
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

          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center" width="200px">
              <FcAddressBook fontSize="1.5rem" />
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

          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            mt="1rem"
          >
            <Box display="flex" alignItems="center" width="200px">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fontSize="1.2rem"
                sx={{ color: main }}
                width="1.25em"
                height="1em"
                viewBox="0 0 640 512"
              >
                <path
                  fill="#765dee"
                  d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32S80 82.1 80 144s50.1 112 112 112m76.8 32h-8.3c-20.8 10-43.9 16-68.5
                   16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-
                   115.2-115.2-115.2M480 256c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96s43 96 96 96m48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-
                   30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4c24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21
                   .5 48-48c0-61.9-50.1-112-112-112"
                />
              </svg>
              <Typography
                fontWeight="600"
                width="80px"
                textAlign="left"
                marginLeft="0.5rem"
              >
                Friend
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
              {friends.length} Friends
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            mt="1rem"
          >
            <Box display="flex" alignItems="center" width="200px">
              <FcStackOfPhotos fontSize="1.7rem" />

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
      </WidgetWrapper>
    </Box>
  );
};

export default UserWidgetProfile;
