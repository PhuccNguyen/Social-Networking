import { ManageAccountsOutlined, EditOutlined, Dashboard, People, Campaign } from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, Button, IconButton } from "@mui/material";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import Settingprofile from "components/settingprofile";
import Dasdboard from 'views/widgets/AdminManager';
import AdminCampain from 'views/widgets/AdminCampain';
import AssistantAdmin from 'views/widgets/AssistantAdmin';
import AdminRole from 'views/widgets/AdminRole';
import IdentifyRoleAdmin from "components/IdentifyRoleAdmin";
import IdentifyRoleAsistantAdmin from "components/IdentifyRoleAsistantAdmin";
import { useSelector } from "react-redux";

const AdminWidget = ({ userId, picturePath, role,}) => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  // Fetch user information
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

  // Function to render the active section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'Dashboard': return <Dasdboard />;
      case 'AssistantAdmin': return <AssistantAdmin />;
      case 'Role': return <AdminRole userId={userId} />;
      case 'Campaign': return <AdminCampain />;
      default: return null;
    }
  };

  return (
    <Box display="flex" width="100%" height="100%">
      {/* Sidebar */}
      <WidgetWrapper
        width={isSidebarExpanded ? "20%" : "5%"}
        height="100vh"
        position="fixed"
        top="0"
        left="0"
        boxShadow="0px 6px 13px 3px rgba(0, 0, 0, 0.1)"
        sx={{ overflowY: 'auto', padding: isSidebarExpanded ? "2rem" : "1rem" }}
      >
        <Box display="flex" flexDirection="column" alignItems={isSidebarExpanded ? "flex-start" : "center"}>
          {/* Toggle Sidebar */}
          <IconButton onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} sx={{ mb: 2 }}>
            <ManageAccountsOutlined fontSize="large" />
          </IconButton>

          {/* User Profile Section */}
          <Box
            display="flex"
            alignItems="center"
            gap="1rem"
            onClick={() => navigate(`/profile/${userId}`)}
            sx={{ "&:hover": { cursor: "pointer" }, mb: 3, position: "relative" }}
          >
            <UserImage image={picturePath} />
            {isSidebarExpanded && (
              <Box>
                <Typography variant="h6" color={dark} fontWeight="500">
                  {firstName} {lastName}
                </Typography>
                {/* Role Badge */}
                <Box display="flex" alignItems="center" mt="-0.6rem" ml="0.6rem">
                  {role === "admin" && (
                    <IdentifyRoleAdmin />
                  )}
                  {role === "assistantAdmin" && (
                    <IdentifyRoleAsistantAdmin />
                  )}
                </Box>
              </Box>
            )}
            {/* Right-aligned settings icon */}
            {isSidebarExpanded && <Settingprofile />}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Sidebar Navigation Buttons */}
          <Box display="flex" flexDirection="column" gap="1.5rem">
            <Button
              startIcon={<Dashboard />}
              onClick={() => setActiveSection('Dashboard')}
              sx={{
                justifyContent: isSidebarExpanded ? "flex-start" : "center",
                color: main,
                fontWeight: "bold",
                textAlign: "left",
                backgroundColor: activeSection === 'Dashboard' ? "#f0f0f0" : "transparent",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              {isSidebarExpanded && "Dashboard"}
            </Button>

            <Button
              startIcon={<People />}
              onClick={() => setActiveSection('AssistantAdmin')}
              sx={{
                justifyContent: isSidebarExpanded ? "flex-start" : "center",
                color: main,
                fontWeight: "bold",
                textAlign: "left",
                backgroundColor: activeSection === 'AssistantAdmin' ? "#f0f0f0" : "transparent",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              {isSidebarExpanded && "Manage Assistant Admins"}
            </Button>

            <Button
              startIcon={<ManageAccountsOutlined />}
              onClick={() => setActiveSection('Role')}
              sx={{
                justifyContent: isSidebarExpanded ? "flex-start" : "center",
                color: main,
                fontWeight: "bold",
                textAlign: "left",
                backgroundColor: activeSection === 'Role' ? "#f0f0f0" : "transparent",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              {isSidebarExpanded && "Manage Roles"}
            </Button>

            <Button
              startIcon={<Campaign />}
              onClick={() => setActiveSection('Campaign')}
              sx={{
                justifyContent: isSidebarExpanded ? "flex-start" : "center",
                color: main,
                fontWeight: "bold",
                textAlign: "left",
                backgroundColor: activeSection === 'Campaign' ? "#f0f0f0" : "transparent",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              {isSidebarExpanded && "Manage Campaigns"}
            </Button>
          </Box>
        </Box>
      </WidgetWrapper>

      {/* Main Content Area */}
      <Box
        flexGrow={1}
        padding="2rem"
        marginLeft={isSidebarExpanded ? "20%" : "5%"}
        height="100%"
        overflowY="auto"
      >
        <Typography variant="h4" mb={1} color={dark} fontWeight="600">
          {activeSection}
        </Typography>
        {renderSectionContent()}
      </Box>
    </Box>
  );
};

export default AdminWidget;
