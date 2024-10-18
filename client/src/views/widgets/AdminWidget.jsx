import { ManageAccountsOutlined, EditOutlined } from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, Button } from "@mui/material";
import React, { useState, useEffect } from 'react';
import { FcBookmark } from "react-icons/fc";
import UserImage from "components/UserImage";
import AdjustContent from "components/Adjustment";
import WidgetWrapper from "components/WidgetWrapper";
import Settingprofile from "components/settingprofile";
import IdentifyRoleAdmin from "components/IdentifyRoleAdmin";
import IdentifyRoleAsistantAdmin from "components/IdentifyRoleAsistantAdmin";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath, role }) => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('Dashboard'); // Active section state
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();

  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const userRole = role;

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data);
    } else {
      console.error("Failed to fetch user data - UserWidget:");
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  const { firstName, lastName } = user;

  // Define the function to get the section title
const getSectionTitle = () => {
    switch (activeSection) {
      case 'Dashboard':
        return 'Dashboard Information EX';
      case 'Asistantadmin':
        return 'Manage Assistant Admin';
      case 'Role':
        return 'Manage Role Users';
      case 'Campaign':
        return 'Manage Campaign';
      default:
        return 'General Manager'; // Default title
    }
  };
  

  // Function to render the section content based on activeSection state
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return (
          <Box sx={{ textAlign: 'justify' }}>
            <Typography>
              This is the admin page showing Dashboard with Total Information in EX.
            </Typography>
          </Box>
        );
      case 'AssistantAdmin':
        return (
          <Box sx={{ textAlign: 'justify' }}>
            <Typography variant="body1" color={medium}>
              This is the admin page showing the Assistant Admin section, where you can manage assistants.
            </Typography>
          </Box>
        );
      case 'Role':
        return (
          <Box>
            <Typography variant="body1" color={medium}>
              This page allows admins to manage user roles.
            </Typography>
          </Box>
        );
      case 'Campaign':
        return (
          <Box>
            <Typography variant="body1" color={medium}>
              This page shows ongoing and completed campaigns in EX.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box display="flex">
      {/* 30% General Manager Section */}
      <WidgetWrapper width="30%" boxShadow="0px 6px 13px 3px rgba(0, 0, 0, 0.1)">
        <Box p="1rem">
          <Box onClick={() => navigate(`/profile/${userId}`)} sx={{ "&:hover": { cursor: "pointer" } }}>
            <Box display="flex" gap="1.5rem" alignItems="center">
              <UserImage image={picturePath} />
              <Box>
                <Typography variant="h5" color={dark} fontWeight="500">
                  {firstName} {lastName}
                </Typography>
                {userRole === "admin" && <IdentifyRoleAdmin />}
                {userRole === "assistantAdmin" && <IdentifyRoleAsistantAdmin />}
              </Box>
            </Box>
            <Settingprofile />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box gap="1.5rem" p="1rem 0rem 0rem 0">
            <Typography fontSize="1rem" color={main} fontWeight="500" mb="0.6rem">
              General Manager
            </Typography>

            {/* Buttons for different sections */}
            <Button
              variant="contained"
              fullWidth
              onClick={() => setActiveSection('Dashboard')}
              sx={{ mb: 1, backgroundColor: "#7928CA", color: "#fff" }}
            >
              Dashboard
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setActiveSection('AssistantAdmin')}
              sx={{ mb: 1, backgroundColor: "#7928CA", color: "#fff" }}
            >
              Manage Assistant Admins
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setActiveSection('Role')}
              sx={{ mb: 1, backgroundColor: "#7928CA", color: "#fff" }}
            >
              Manage Roles
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setActiveSection('Campaign')}
              sx={{ mb: 1, backgroundColor: "#7928CA", color: "#fff" }}
            >
              Manage Campaigns
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Shortcut Section */}
        <Box p="1rem 0">
          <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
            Shortcut
          </Typography>

          {/* Friend Button */}
          <Box display="flex" alignItems="center" gap="0.5rem" mb="0.5rem" width="100%">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 640 512" fill="#765dee">
              <path d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32S80 82.1 80 144s50.1 112 112 112m76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2M480 256c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96s43 96 96 96m48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4c24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48c0-61.9-50.1-112-112-112"/>
            </svg>
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
                transition: 'background-color 0.2s ease, color 0.2s ease',
                '&:hover': {
                  background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                  color: "#fff",
                },
              }}
            >
              Friend
            </Button>
          </Box>

          {/* Saved Button */}
          <Box display="flex" alignItems="center" gap="0.5rem" mb="0.5rem" width="100%">
            <FcBookmark fontSize="1.5rem" width="1.2em" height="1.2em" />
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
                transition: 'background-color 0.2s ease, color 0.2s ease',
                '&:hover': {
                  background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                  color: "#fff",
                },
              }}
            >
              Saved
            </Button>
          </Box>

          {/* Manage Post Button (Visible only for assistantAdmin role) */}
          {userRole === "assistantAdmin" && (
            <Box display="flex" alignItems="center" gap="0.5rem" mb="0.5rem" width="100%">
              <FcBookmark fontSize="1.5rem" width="1.2em" height="1.2em" />
              <Button
                onClick={() => navigate(`/ManagePostsPage`)}
                sx={{
                  backgroundColor: "transparent",
                  color: main,
                  padding: "0.1rem 0.8rem",
                  borderRadius: "1px",
                  width: "100%",
                  textAlign: "start",
                  fontSize: "0.8rem",
                  transition: 'background-color 0.2s ease, color 0.2s ease',
                  '&:hover': {
                    background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                    color: "#fff",
                  },
                }}
              >
                Manage Post
              </Button>
            </Box>
          )}
        </Box>
      </WidgetWrapper>

      {/* 70% Section for Rendering Content */}
      <Box flexGrow={1} ml={3} p={3} boxShadow="0px 6px 13px 3px rgba(0, 0, 0, 0.1)">
        <Typography variant="h4" mb={2} color={dark} fontWeight="600">
          {getSectionTitle()}
        </Typography>
        {renderSectionContent()}
      </Box>
    </Box>
  );
};

export default UserWidget;
