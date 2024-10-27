import { Box, Typography, Breadcrumbs, Link, Paper, Tabs, Tab, useTheme } from '@mui/material';
import Navbar from "views/navbar";
import { useSelector } from 'react-redux';
import UserWidget from 'views/widgets/UserWidget';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import JoinedCampaignsPage  from "views/widgets/JoinedCampaignsPage ";

const UserRegisterCampaign = () => {
    const { _id, picturePath, userName, role } = useSelector((state) => state.user);
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
                    <UserWidget userId={_id} picturePath={picturePath} userName={userName}  role={role} />
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
                            <Typography color="textPrimary">Volunteer Register</Typography>
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
                        <JoinedCampaignsPage userId={_id} />

                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default UserRegisterCampaign;
