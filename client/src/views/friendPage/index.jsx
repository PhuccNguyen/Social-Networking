import { Box, Typography, Breadcrumbs, Link, Paper, Tabs, Tab, useTheme } from '@mui/material';
import Navbar from "views/navbar";
import { useSelector } from 'react-redux';
import UserWidget from 'views/widgets/UserWidget';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import FriendList from "views/widgets/FriendList";
import FriendRequests from "views/widgets/FriendRequests";
import FriendSuggestions from "views/widgets/FriendSuggestions";
import FriendRequestsSent from "views/widgets/FriendRequestsSent";

const FriendPage = () => {
    const { _id, picturePath, userName } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const theme = useTheme(); 

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box>
            <Navbar />
            <Box display="flex" justifyContent="space-between" marginTop="2.8rem" padding="1rem">
                {/* Fixed Left Section: UserWidget */}
                <Box>
                    <UserWidget userId={_id} picturePath={picturePath} userName={userName} />
                </Box>

                {/* Main Content: Friends Management */}
                <Box
                    flex="1"
                    marginLeft="320px"
                    padding="1.5rem"
                    overflow="auto"
                    minHeight="80vh"
                >
                    {/* Fixed Breadcrumbs for navigation */}
                    <Box
                        position="fixed"
                        top="93px"
                        left="390px"
                        right="1rem"
                        padding="0.5rem"
                        zIndex={1000}
                        boxShadow="0px 2px 0px 0px rgba(0, 0, 0, 0.1)"
                    >
                        <Breadcrumbs aria-label="breadcrumb">
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
                    </Box>

                    {/* Content starts below the fixed breadcrumbs */}
                    <Box
                        position="fixed"
                        top="140px"
                        left="390px"
                        right="1rem"
                        zIndex={999}
                        Width="calc(100% - 420px)"
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                borderRadius: "8px",
                                overflow: "hidden",
                                marginBottom: "1rem",
                            }}
                        >
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                aria-label="friend management tabs"
                                sx={{
                                    backgroundColor: theme.palette.mode === 'dark' ? '#333' : 'white',
                                    '& .MuiTab-root': {
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        padding: '0.75rem 1.5rem',
                                        transition: 'background-color 0.3s ease, color 0.3s ease',
                                        color: theme.palette.mode === 'dark' ? 'white' : 'black',
                                    },
                                    '& .Mui-selected': {
                                        background: theme.palette.mode === 'dark' 
                                            ? 'linear-gradient(310deg, #FF0080 0%, #7928CA 100%)' 
                                            : 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
                                        color: 'white',
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                <Tab label="Requests Received" />
                                <Tab label="Requests Sent" />
                                <Tab label="Suggestions" />
                                <Tab label="Friends" />
                            </Tabs>
                        </Paper>

                        {/* Content for each tab */}
                        <Paper elevation={3} sx={{ borderRadius: "8px", padding: "1rem", minHeight: "470px" }}>
                            {tabValue === 0 && <FriendRequests userId={_id} />}
                            {tabValue === 1 && <FriendRequestsSent userId={_id} />}
                            {tabValue === 2 && <FriendSuggestions userId={_id} />}
                            {tabValue === 3 && <FriendList userId={_id} />}
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default FriendPage;
