import { Box, Typography, Button, useTheme, Divider } from "@mui/material";
import React, { useState } from 'react';
import WidgetWrapper from "components/WidgetWrapper";
import EditUser from "views/widgets/EditUser";
import UserSecurity from "views/widgets/UserSecurity";
import UserAbout from "views/widgets/UserAbout";
import PostUser from "views/widgets/UserWidgetPost";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const UserWidgetInformation = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('post');
  const loggedInUserId = useSelector((state) => state.user._id); // ID of logged-in user 
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

  const { firstName, lastName, status, email, location, occupation, friends, intro } = user;

    // Open and close dialog for editing
    const handleOpenDialog = () => {
    };

  // Function to get the section title
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'post':
        return 'Post';
      case 'about':
        return 'About';
      case 'edit':
        return 'Details Information';
      case 'experiences':
        return 'Experiences';
      case 'security':
        return ' Password and security';
      default:
        return '';
    }
  };

  // Function to render the section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'post':
        return (
          <Box sx={{ textAlign: 'justify' }}> {/* Set text alignment to justified */}
            <Typography>
              <PostUser userId={userId} isProfile={true}/>
            </Typography>
          </Box>
        );

      case 'about':
        return (
          <Box sx={{ textAlign: 'justify' }}> {/* Set text alignment to justified */}

          <Typography >
              <UserAbout userId={userId} user={user}/>
            </Typography>
          </Box>
        );

      case 'edit':
        return (
          <Box>
            <Typography variant="body1" color={medium}>
            <EditUser userId={userId} user={user} />
            </Typography>
            <Box> 
          </Box>
          </Box>
        );
      case 'experiences':
        return (
          <Box>
            <Typography variant="body1" color={medium}>
              This is show Occupation and Experience Volunteer information.
            </Typography>
          </Box>
        );      
      case 'security':
        return (
          <Box>
            <Typography variant="body1" color={medium}>
            <UserSecurity userId={userId} user={user} />
            </Typography>
            <Box> 
          </Box>
          </Box>
        );

      default:

        return null;
    }
  };

  return (
    <WidgetWrapper
      sx={{
        padding: "1rem",
        borderRadius: "12px",
        boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
        backgroundColor: palette.background.paper,
      }}
    >
      
      {/* Title and Buttons in the same row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: '1rem',
        }}
      >
        {/* Fixed Title */}
        <Typography variant="h6" color={dark} fontWeight="600">
          {getSectionTitle()}
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
        <Button
            variant={activeSection === 'post' ? "contained" : "outlined"}
            onClick={() => setActiveSection('post')}
            sx={{
              color: activeSection === 'post' ? "#fff" : main,
              minWidth: '100px',
            }}
          >
            Post
          </Button>
          <Button
            variant={activeSection === 'about' ? "contained" : "outlined"}
            onClick={() => setActiveSection('about')}
            sx={{
              color: activeSection === 'about' ? "#fff" : main,
              minWidth: '100px',
            }}
          >
            About
          </Button>
          <Button
            variant={activeSection === 'edit' ? "contained" : "outlined"}
            onClick={() => setActiveSection('edit')}
            sx={{
              color: activeSection === 'edit' ? "#fff" : main,
              minWidth: '100px',
            }}
          >
            Details Information
          </Button>

          <Button
            variant={activeSection === 'experiences' ? "contained" : "outlined"}
            onClick={() => setActiveSection('experiences')}
            sx={{
              color: activeSection === 'experiences' ? "#fff" : main,
              minWidth: '100px',
            }}
          >
            Experiences
          </Button>
      {/* Show  Password and security button only if the logged-in user is viewing their own profile */}
      {loggedInUserId === userId && (
          <Button
          variant={activeSection === 'security' ? "contained" : "outlined"}
          onClick={() => setActiveSection('security')}
          sx={{
            color: activeSection === 'security' ? "#fff" : main,
            minWidth: '100px',
          }}
        >
          Password and security
        </Button>
      )}
      



        </Box>
      </Box>

      <Divider />

      {/* Section Content */}
      <Box mt="1rem" width="95%" mx="auto"> {/* Set width to 95% and center the content */}
        {renderSectionContent()}
      </Box>
      
    </WidgetWrapper>
  );
};

export default UserWidgetInformation;
