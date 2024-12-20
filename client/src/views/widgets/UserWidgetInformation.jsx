import { Box, Typography, Button, useTheme, Divider } from "@mui/material";
import React, { useState } from "react";
import WidgetWrapper from "components/WidgetWrapper";
import EditUser from "views/widgets/EditUser";
import UserSecurity from "views/widgets/UserSecurity";
import UserAbout from "views/widgets/UserAbout";
import ExperienceUser from "views/widgets/ExperienceUser";
import PostUser from "views/widgets/UserWidgetPost";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserWidgetInformation = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("post");
  const loggedInUserId = useSelector((state) => state.user._id); 
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

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

  const {
    firstName,
    lastName,
    status,
    email,
    location,
    occupation,
    friends,
    intro,
  } = user;


  // Function to get the section title
  const getSectionTitle = () => {
    switch (activeSection) {
      case "post":
        return "Post";
      case "about":
        return "About";
      case "edit":
        return "Details Information";
      case "experiences":
        return "Experiences";
      case "securities":
        return " Password and security";
      default:
        return "";
    }
  };

  // Function to render the section content
  const renderSectionContent = ( ) => {
    switch (activeSection) {
      case "post":
        return (
          <Box sx={{ textAlign: "justify" }}>
            <Typography>
              <PostUser userId={userId} user={user} isProfile={true} />
            </Typography>
          </Box>
        );

      case "about":
        return (
          <Box sx={{ textAlign: "justify" }}>
            {" "}
            <Typography>
              <UserAbout userId={userId} user={user} />
            </Typography>
          </Box>
        );

      case "edit":
        return (
          <Box>
            <Typography variant="body1" color={medium}>
              <EditUser userId={userId} user={user} />
            </Typography>
            <Box></Box>
          </Box>
        );
      case "experiences":
        return (
          <Box>
            <Typography variant="body1" color={medium}>
              <ExperienceUser userId={userId} user={user} />
            </Typography>
          </Box>
        );
      case "securities":
        return (
          <Box>
            <Typography variant="body1" color={medium}>
              <UserSecurity userId={userId} user={user} />
            </Typography>
            <Box></Box>
          </Box>
        );

      default:
        return null;
    }
  };

  const buttonStyles = (section) => ({
    minWidth: "100px",
    color: activeSection === section ? "#fff" : main,
    background:
      activeSection === section
        ? "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)"
        : "transparent",
    border: activeSection === section ? "none" : `1px solid ${main}`,
    transition: "background 0.3s, transform 0.2s",
    "&:hover": {
      background:
        activeSection === section
          ? "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)"
          : main,
      color: "#fff",
      transform: "scale(1.05)",
    },
  });

  return (

    <WidgetWrapper
      sx={{
        padding: "1rem",
        borderRadius: "12px",
        boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
        backgroundColor: palette.background.paper,
      }}
    >
    {/* Title Section */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        paddingBottom: "0.5rem",
        marginBottom: "0.8rem",
      }}
    >
      <Typography
        variant="h5"
        color={dark}
        fontWeight="500"
        sx={{
          textTransform: "capitalize",
          fontSize: "1rem", 
        }}
      >
        {getSectionTitle()}
      </Typography>

    </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "1rem",
        }}
      >
        <Box sx={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button
            variant="contained"
            onClick={() => setActiveSection("post")}
            sx={buttonStyles("post")}
          >
            Post
          </Button>
          <Button
            variant="contained"
            onClick={() => setActiveSection("about")}
            sx={buttonStyles("about")}
          >
            About
          </Button>

          <Button
            variant="contained"
            onClick={() => setActiveSection("edit")}
            sx={buttonStyles("edit")}
          >
            Details Information
          </Button>

          <Button
            variant="contained"
            onClick={() => setActiveSection("experiences")}
            sx={buttonStyles("experiences")}
          >
            Experiences
          </Button>


          {loggedInUserId === userId && (
            <Button
              variant="contained"
              onClick={() => setActiveSection("securities")}
              sx={buttonStyles("securities")}
            >
              Password and Security
            </Button>
          )}
        </Box>
      </Box>
      
      <Divider />
      {/* Section Content */}
      <Box mt="1rem" width="95%" mx="auto">
        {" "}
        {renderSectionContent()}
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidgetInformation;
