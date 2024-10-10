import { Box, Typography, Breadcrumbs, Link, Button, Tabs, Tab } from '@mui/material';
import Navbar from "views/navbar";
import { useSelector } from 'react-redux';
import UserWidget from 'views/widgets/UserWidget';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import FriendList from "views/widgets/FriendList";
import FriendRequests from "views/widgets/FriendRequests";
import FriendSuggestions from "views/widgets/FriendSuggestions";


const FriendPage = () => {
    const { _id, picturePath, userName } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box>
            <Navbar />
            <Box
                display="flex"
                justifyContent="space-between"
                marginTop="2.8rem" 
            >
                {/* Fixed Left Section: UserWidget */}
                <Box
                    flexBasis="300px"
                    position="fixed"
                    left="0"
                    top="90px" 
                    height="100%"
                    padding="1rem"
                    zIndex={1000} 
                    boxShadow="2px 0 5px rgba(0, 0, 0, 0.1)" 
                >
                    <UserWidget userId={_id} picturePath={picturePath} userName={userName} />
                </Box>

                {/* Main Content: Friends Management */}
                <Box
                    flex="1"
                    marginLeft="330px" 
                    padding="2rem"
                    overflow="auto" 
                >
                    <Breadcrumbs aria-label="breadcrumb" marginLeft="30px" marginTop="28px" sx={{ marginBottom: "1rem" }}>
                        <Link
                            underline="hover"
                            color="inherit"
                            onClick={() => navigate('/Home')}
                            sx={{ cursor: "pointer" }}
                        >
                            Home
                        </Link>
                        <Typography color="textPrimary">Friends</Typography>
                    </Breadcrumbs>

                    {/* Tabs for Friend Management */}
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="friend management tabs">
                        <Tab label="Requests Received" />
                        <Tab label="Requests Sent" />
                        <Tab label="Suggestions" />
                        <Tab label="Friends" />
                    </Tabs>

                    {/* Content for each tab */}
                    {tabValue === 0 && <FriendRequests userId={_id} />}
                    {tabValue === 1 && <FriendRequests userId={_id} type="sent" />}
                    {tabValue === 2 && <FriendSuggestions userId={_id} />}
                    {tabValue === 3 && <FriendList userId={_id} />}
                </Box>
            </Box>
        </Box>
    );
};

export default FriendPage;
