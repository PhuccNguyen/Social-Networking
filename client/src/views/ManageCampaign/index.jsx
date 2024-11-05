import { Box, Typography, Breadcrumbs, Link, Paper, Tabs, Tab, useTheme } from '@mui/material';
import Navbar from "views/navbar";
import { useSelector } from 'react-redux';
import UserWidget from 'views/widgets/UserWidget';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import ManageCampaignWidget from "views/widgets/ManageCampaignWidget.jsx";
import ManageCampaignWidgetByUser from "views/widgets/ManageCampaignWidgetByUser.jsx";

 
const ManaggeCampaign = () => {
  const { _id, picturePath, userName, role } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const [campaignCounts, setCampaignCounts] = useState({ upcoming: 0, ongoing: 0, ended: 0 });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchCampaignCounts = async () => {
      const response = await fetch("http://localhost:3001/volunteer/campaign-counts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCampaignCounts(data);
    };
    fetchCampaignCounts();
  }, []);

  return (
    <Box>
      <Navbar />
      <Box display="flex" justifyContent="space-between" marginTop="2.8rem" padding="1rem">
        <Box>
          <UserWidget userId={_id} picturePath={picturePath} userName={userName} role={role} />
        </Box>

        <Box flex="1" marginLeft="320px" padding="1.5rem" overflow="hidden" minHeight="80vh">
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
              <Link underline="hover" color="inherit" onClick={() => navigate('/Home')} sx={{ cursor: "pointer" }}>
                Home
              </Link>
              <Typography color="textPrimary">Manage Campaign</Typography>
            </Breadcrumbs>
          </Box>

          <Box position="fixed" top="140px" left="390px" right="1rem" zIndex={999} width="calc(100% - 420px)">
            <Paper elevation={3} sx={{ borderRadius: "4px", overflow: "hidden", marginBottom: "1rem" }}>
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
                  <Tab label="All Campaigns" />
                <Tab label={`Upcoming Campaigns (${campaignCounts.upcoming})`} />
                <Tab label={`Ongoing Campaigns (${campaignCounts.ongoing})`} />
                <Tab label={`Ended Campaigns (${campaignCounts.ended})`} />
              </Tabs>
            </Paper>

            <Paper elevation={3} sx={{ borderRadius: "4px", padding: "1rem", minHeight: "470px", overflowY: 'auto', maxHeight: '70vh' }}>
              {tabValue === 0 && <ManageCampaignWidget userId={_id} />}
              {tabValue === 1 && <ManageCampaignWidget userId={_id} status="upcoming" />}
              {tabValue === 2 && <ManageCampaignWidget userId={_id} status="ongoing" />}
              {tabValue === 3 && <ManageCampaignWidget userId={_id} status="ended" />}
            </Paper>
          </Box>      
        </Box>
      </Box>
    </Box>
  );
};

export default ManaggeCampaign;
