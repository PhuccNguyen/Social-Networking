import { ManageAccountsOutlined, EditOutlined } from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, Button } from "@mui/material";
import React from "react";
import { FcBookmark } from "react-icons/fc";
import UserImage from "components/UserImage";
import AdjustContent from "components/Adjustment";
import WidgetWrapper from "components/WidgetWrapper";
import Settingprofile from "components/settingprofile";
import IdentifyRoleAdmin from "components/IdentifyRoleAdmin";
import IdentifyRoleAsistantAdmin from "components/IdentifyRoleAsistantAdmin";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath, role }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();

  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  // Use the 'role' passed as a prop
  const userRole = role;

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Fetched User Data Successful From UW:", data); //check
      setUser(data);
    } else {
      console.error("Failed to fetch user data - UserWidget:");
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    status,
    email,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
    <WidgetWrapper
      position="fixed"
      margin="-0.5rem 1rem 1rem 1rem"
      top="14.5%"
      zIndex={100}
      right="74%"
      width="370px"
      boxShadow="0px 6px 13px 3px rgba(0, 0, 0, 0.1)"
    >
      {/******** One *******/}
      <AdjustContent
        gap="0.5rem"
        mb="0.4rem"
        onClick={() => navigate(`/profile/${userId}`)}
        sx={{
          "&:hover": {
            cursor: "pointer",
          },
        }}
      >
        <AdjustContent gap="1.5rem">
          <UserImage image={picturePath} />
          {userRole === "assistantAdmin" && <IdentifyRoleAsistantAdmin />}
          {userRole === "admin" && <IdentifyRoleAdmin />}
          <Box>
            <Typography
              variant="h5"
              color={dark}
              fontWeight="500"
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
              {firstName} {lastName}
            </Typography>
          </Box>
        </AdjustContent>
        <Settingprofile />
      </AdjustContent>
      <Divider />

      <Box gap="1.5rem" p="1rem 0rem 0rem 0">
  <Typography fontSize="1.2rem" color={main} fontWeight="600" mb="1rem">
    Profiles
  </Typography>

  {/* Location */}
  <Box display="flex" alignItems="center" gap="1rem" mb="1rem">
    {/* Image Icon */}
    <img
      src="/assets/circle.png"
      alt="Location Icon"
      style={{        width: "2.1rem",
        height: "2.1rem", objectFit: "contain" }}
    />

    {/* Location Text */}
    <Typography
      variant="h6"
      fontWeight="400"
      color={dark}
      sx={{
        "&:hover": {
          WebkitTextFillColor: "transparent",
          background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
          WebkitBackgroundClip: "text",
          cursor: "pointer",
        },
      }}
    >
      {location}
    </Typography>
  </Box>

  {/* Email */}
  <Box display="flex" alignItems="center" gap="1rem" mb="1rem">
    {/* Image Icon */}
    <img
      src="/assets/email.png"
      alt="Email Icon"
      style={{         width: "2.1rem",
        height: "2.1rem", objectFit: "contain" }}
    />

    {/* Email Text */}
    <Typography
      variant="h6"
      fontWeight="400"
      color={dark}
      sx={{
        "&:hover": {
          WebkitTextFillColor: "transparent",
          background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
          WebkitBackgroundClip: "text",
          cursor: "pointer",
        },
      }}
    >
      {email}
    </Typography>
  </Box>

  {/* Occupation */}
  <Box display="flex" alignItems="center" gap="1rem" mb="1rem">
    {/* Image Icon */}
    <img
      src="/assets/work.jpg"
      alt="Occupation Icon"
      style={{
        width: "2.1rem",
        height: "2.1rem",
        borderRadius: "50%", // Optional: Circular styling
        objectFit: "cover",
      }}
    />

    {/* Occupation Text */}
    <Typography
      variant="h6"
      fontWeight="400"
      color={dark}
      sx={{
        "&:hover": {
          WebkitTextFillColor: "transparent",
          background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
          WebkitBackgroundClip: "text",
          cursor: "pointer",
        },
      }}
    >
      {occupation}
    </Typography>
  </Box>

  {/* Friends */}
  <Box display="flex" alignItems="center" gap="1rem" mb="1rem">
    {/* Image Icon */}
    <img
      src="/assets/friend.jpg"
      alt="Friends Icon"
      style={{
        width: "2.1rem",
        height: "2.1rem",
        borderRadius: "50%", // Optional: Circular appearance
        objectFit: "cover",
      }}
    />

    {/* Friends Count Text */}
    <Typography
      variant="h6"
      fontWeight="400"
      color={dark}
      sx={{
        "&:hover": {
          WebkitTextFillColor: "transparent",
          background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
          WebkitBackgroundClip: "text",
          cursor: "pointer",
        },
      }}
    >
      {friends.length} Friends
    </Typography>
  </Box>
</Box>

      <Divider p="4rem 0" />

      {/******** Shortcut *******/}
      <Box p="1rem 0">
        <Typography fontSize="1.2rem" color={main} fontWeight="600" mb="1rem">
          Shortcut
        </Typography>

        {/* Friend Button */}
        <Box
  display="flex"
  alignItems="center"
  gap="0.5rem"
  mb="0.5rem"
  width="100%"
>
  {/* Replace SVG with Image Icon */}
  <img
    src="/assets/environmentalism.png"
    alt="Status Icon"
    style={{
      width: "2rem", // Adjust the size to match the layout
      height: "2rem",
      objectFit: "contain",
    }}
  />

  {/* Button for Friend Page */}
  <Button
    onClick={() => navigate(`/friendPage`)}
    sx={{
      backgroundColor: "transparent",
      color: main,
      padding: "0.1rem 0.8rem",
      borderRadius: "1px",
      width: "100%",
      textAlign: "start",
      fontSize: "0.8rem",
      transition: "background-color 0.2s ease, color 0.2s ease",
      "&:hover": {
        background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
        color: "#fff",
      },
    }}
  >
    Friend
  </Button>
</Box>


        {/* Saved Button */}
<Box
  display="flex"
  alignItems="center"
  gap="0.5rem"
  mb="0.5rem"
  width="100%"
>
  {/* Replace Icon with Image */}
  <img
    src="/assets/bookmark.png"
    alt="Saved Icon"
    style={{
      width: "2rem", // Adjust the size to match the layout
      height: "2rem",
      objectFit: "contain",
    }}
  />
  <Button
    onClick={() => navigate(`/SavedPostsPage`)}
    sx={{
      backgroundColor: "transparent",
      color: main,
      padding: "0.1rem 0.8rem",
      borderRadius: "1px",
      width: "100%",
      textAlign: "start",
      fontSize: "0.8rem",
      transition: "background-color 0.2s ease, color 0.2s ease",
      "&:hover": {
        background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
        color: "#fff",
      },
    }}
  >
    Saved
  </Button>
</Box>

        <Box
  display="flex"
  alignItems="center"
  gap="0.5rem"
  mb="0.5rem"
  width="100%"
>
  {/* Replace SVG Icon with Image */}
  <img
    src="/assets/volunteer.png"
    alt="Status Icon"
    style={{
      width: "2rem", // Adjust size for better alignment
      height: "2rem",
      objectFit: "contain",
    }}
  />

  {/* Button for User Register Campaign */}
  <Button
    onClick={() => navigate(`/UserRegisterCampaign`)}
    sx={{
      backgroundColor: "transparent",
      color: main,
      padding: "0.1rem 0.8rem",
      borderRadius: "1px",
      width: "100%",
      textAlign: "start",
      fontSize: "0.8rem",
      transition: "background-color 0.2s ease, color 0.2s ease",
      "&:hover": {
        background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
        color: "#fff",
      },
    }}
  >
    Volunteer
  </Button>
</Box>


       {/* Saved Button */}
{(userRole === "assistantAdmin" || userRole === "admin") && (
  <Box
    display="flex"
    alignItems="center"
    gap="0.5rem"
    mb="0.5rem"
    width="100%"
  >
    {/* Replace SVG Icon with Image */}
    <img
      src="/assets/pen.png"
      alt="Manage Campaign Icon"
      style={{
        width: "2rem", // Adjust the size for better alignment
        height: "2rem",
        objectFit: "contain",
      }}
    />
    <Button
      onClick={() => navigate(`/ManageCampaign`)}
      sx={{
        backgroundColor: "transparent",
        color: main,
        padding: "0.1rem 0.8rem",
        borderRadius: "1px",
        width: "100%",
        textAlign: "start",
        fontSize: "0.8rem",
        transition: "background-color 0.2s ease, color 0.2s ease",
        "&:hover": {
          background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
          color: "#fff",
        },
      }}
    >
      Manage
    </Button>
  </Box>
)}

      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
