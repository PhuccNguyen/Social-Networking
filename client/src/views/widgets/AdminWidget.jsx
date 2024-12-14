import {
  Dashboard,
  People,
  AccountCircle,
  Campaign,
  Settings,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import Settingprofile from "components/settingprofile";
import Dasdboard from "views/widgets/AdminManager";
import AdminCampain from "views/widgets/AdminCampain";
import AssistantAdmin from "views/widgets/AssistantAdmin";
import AdminRole from "views/widgets/AdminRole";
import IdentifyRoleAdmin from "components/IdentifyRoleAdmin";
import IdentifyRoleAsistantAdmin from "components/IdentifyRoleAsistantAdmin";
import { useSelector } from "react-redux";

const AdminWidget = ({ userId, picturePath, role }) => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const textColor = palette.mode === "dark" ? "#fff" : "#000"; // Text color depending on theme

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
  }, []);

  if (!user) return null;
  const { firstName, lastName } = user;

  const renderSectionContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return <Dasdboard userId={userId} />;
      case "AssistantAdmin":
        return <AssistantAdmin />;
      case "Role":
        return <AdminRole userId={userId} />;
      case "Campaign":
        return <AdminCampain userId={userId} />;
      default:
        return null;
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
        sx={{ overflowY: "auto", padding: isSidebarExpanded ? "2rem" : "1rem" }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems={isSidebarExpanded ? "flex-start" : "center"}
        >
          <IconButton
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            sx={{ mb: 2 }}
          >
            <AccountCircle fontSize="large" />
          </IconButton>

          <Box
            display="flex"
            alignItems="center"
            gap="1rem"
            onClick={() => navigate(`/profile/${userId}`)}
            sx={{
              "&:hover": { cursor: "pointer" },
              mb: 3,
              position: "relative",
            }}
          >
            <UserImage image={picturePath} />
            {isSidebarExpanded && (
              <Box>
                <Typography variant="h6" color={dark} fontWeight="500">
                  {firstName} {lastName}
                </Typography>

                <Box
                  display="flex"
                  alignItems="center"
                  mt="-0.6rem"
                  ml="0.6rem"
                >
                  {role === "admin" && <IdentifyRoleAdmin />}
                  {role === "assistantAdmin" && <IdentifyRoleAsistantAdmin />}
                </Box>
              </Box>
            )}

            {isSidebarExpanded && <Settingprofile />}
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box display="flex" flexDirection="column" gap="1.5rem">
            {/* Dashboard Button */}
            <Tooltip title="Dashboard" arrow>
              <Button
                startIcon={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/dashboard (1).png"
                      alt="Premium Badge"
                      sx={{ width: "40px", height: "40px" }}
                    />
                  </Box>
                }
                onClick={() => setActiveSection("Dashboard")}
                sx={{
                  justifyContent: "flex-start",
                  width: "100%",
                  color: activeSection === "Dashboard" ? "#fff" : textColor,
                  fontWeight: "bold",
                  textAlign: "left",
                  background:
                    activeSection === "Dashboard"
                      ? "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)"
                      : "transparent",
                  "&:hover": {
                    background:
                      "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                  },
                }}
              >
                {isSidebarExpanded && "Dashboard"}
              </Button>
            </Tooltip>

            {/* Assistant Admin Button */}
            <Tooltip title="Manage Assistant Admins" arrow>
              <Button
                startIcon={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/friendship.png"
                      alt="Premium Badge"
                      sx={{ width: "40px", height: "40px" }}
                    />
                  </Box>
                }
                onClick={() => setActiveSection("AssistantAdmin")}
                sx={{
                  justifyContent: "flex-start",
                  width: "100%",
                  color:
                    activeSection === "AssistantAdmin" ? "#fff" : textColor,
                  fontWeight: "bold",
                  textAlign: "left",
                  background:
                    activeSection === "AssistantAdmin"
                      ? "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)"
                      : "transparent",
                  "&:hover": {
                    background:
                      "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                  },
                }}
              >
                {isSidebarExpanded && "Manage Assistant Admins"}
              </Button>
            </Tooltip>

            {/* Manage Roles Button */}
            <Tooltip title="Manage Roles" arrow>
              <Button
                startIcon={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/manager.png"
                      alt="Premium Badge"
                      sx={{ width: "40px", height: "40px" }}
                    />
                  </Box>
                }
                onClick={() => setActiveSection("Role")}
                sx={{
                  justifyContent: "flex-start",
                  width: "100%",
                  color: activeSection === "Role" ? "#fff" : textColor,
                  fontWeight: "bold",
                  textAlign: "left",
                  background:
                    activeSection === "Role"
                      ? "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)"
                      : "transparent",
                  "&:hover": {
                    background:
                      "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                  },
                }}
              >
                {isSidebarExpanded && "Manage Roles"}
              </Button>
            </Tooltip>

            {/* Campaign Management Button */}
            <Tooltip title="Manage Campaigns" arrow>
              <Button
                startIcon={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/advertising.png"
                      alt="Premium Badge"
                      sx={{ width: "40px", height: "40px" }}
                    />
                  </Box>
                }
                onClick={() => setActiveSection("Campaign")}
                sx={{
                  justifyContent: "flex-start",
                  width: "100%",
                  color: activeSection === "Campaign" ? "#fff" : textColor,
                  fontWeight: "bold",
                  textAlign: "left",
                  background:
                    activeSection === "Campaign"
                      ? "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)"
                      : "transparent",
                  "&:hover": {
                    background:
                      "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                  },
                }}
              >
                {isSidebarExpanded && "Manage Campaigns"}
              </Button>
            </Tooltip>
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
