import { Box, Typography, Breadcrumbs, Link, Paper, Tabs, Tab, useTheme } from '@mui/material';
import Navbar from "views/navbar";
import { useSelector } from 'react-redux';
import UserWidget from 'views/widgets/UserWidget';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import ManageCampaignWidget from "views/widgets/ManageCampaignWidget.jsx";

const ManaggeCampaign = () => {
    const { _id, picturePath, userName, role } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const theme = useTheme(); 
    const [campaignCounts, setCampaignCounts] = useState({ ongoing: 0, started: 0, ended: 0 });

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        // Fetch and update campaign counts
        const fetchCampaignCounts = async () => {
            // Replace with actual backend API to get counts for each category
            const response = await fetch("http://localhost:3001/volunteer/campaign-counts");
            const data = await response.json();
            setCampaignCounts(data);
        };

        fetchCampaignCounts();
    }, []);

    return (
        <Box>
            <Navbar />
            <Box display="flex" justifyContent="space-between" marginTop="2.8rem" padding="1rem">
                {/* Fixed Left Section: UserWidget */}
                <Box>
                    <UserWidget userId={_id} picturePath={picturePath} userName={userName}  role={role} />
                </Box>

                {/* Main Content: Campaign Management */}
                <Box
                    flex="1"
                    marginLeft="320px"
                    padding="1.5rem"
                    overflow="hidden"  
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
                            <Typography color="textPrimary">Manage Campaign</Typography>
                        </Breadcrumbs>
                    </Box>

                    {/* Tabs with Campaign Counts */}
                    <Box
                        position="fixed"
                        top="140px"
                        left="390px"
                        right="1rem"
                        zIndex={999}
                        width="calc(100% - 420px)"
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                borderRadius: "4px",
                                overflow: "hidden",
                                marginBottom: "1rem",
                            }}
                        >
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                aria-label="campaign management tabs"
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
                                <Tab label={`Campaign Ongoing (${campaignCounts.ongoing})`} />
                                <Tab label={`Campaign Started (${campaignCounts.started})`} />
                                <Tab label={`Campaign Ended (${campaignCounts.ended})`} />
                            </Tabs>
                        </Paper>

                        {/* Content for each tab with Scrollable ManageCampaignWidget */}
                        <Paper elevation={3} sx={{ borderRadius: "4px", padding: "1rem", minHeight: "470px", overflowY: 'auto', maxHeight: '70vh' }}>
                            <ManageCampaignWidget userId={_id} status={tabValue === 0 ? "ongoing" : tabValue === 1 ? "started" : "ended"} />
                        </Paper>
                    </Box>      
                </Box>
            </Box>
        </Box>
    );
};

export default ManaggeCampaign;
