import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  InputBase,
  IconButton,
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Avatar,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

// Fake campaign data
const fakeCampaigns = [
  {
    _id: "1",
    title: "Beach Cleanup",
    description: "Join us to clean up the local beach.",
    registrationStartDate: "2024-10-01",
    registrationEndDate: "2024-10-05",
    maxVolunteers: 50,
    location: "Miami Beach, FL",
    campaignStartDate: "2024-10-06",
    campaignEndDate: "2024-10-15",
    image: "/assets/campaign1.png",
    milestones: ["Initial meeting", "Midway progress", "Final cleanup"],
    createdBy: { username: "AssistantAdmin 1", picturePath: "/assets/admin1.png" },
    status: "ongoing",
  },
  {
    _id: "2",
    title: "Help Homeless Children",
    description: "Support and provide resources for homeless children.",
    registrationStartDate: "2024-09-01",
    registrationEndDate: "2024-09-10",
    maxVolunteers: 100,
    location: "New York, NY",
    campaignStartDate: "2024-09-15",
    campaignEndDate: "2024-09-30",
    image: "/assets/campaign2.png",
    milestones: ["Fundraising", "Initial Supplies", "Closing Event"],
    createdBy: { username: "AssistantAdmin 2", picturePath: "/assets/admin2.png" },
    status: "completed",
  },
];

const CampaignPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState(0); // 0 for ongoing, 1 for completed
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const theme = useTheme();

  // Filter campaigns by search query and status (ongoing or completed)
  const filteredCampaigns = fakeCampaigns.filter((campaign) => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedTab === 0 ? campaign.status === "ongoing" : campaign.status === "completed";
    return matchesSearch && matchesStatus;
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleCampaignClick = (campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleCloseModal = () => {
    setSelectedCampaign(null);
  };

  return (
    <Box padding="2rem">
      {/* Search Bar */}
      <Box display="flex" alignItems="center" mb={3}>
        <InputBase
          placeholder="Search campaigns by title or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: "100%",
            backgroundColor: theme.palette.background.paper,
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        />
        <IconButton
          sx={{
            ml: 2,
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            padding: "0.75rem",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <Search />
        </IconButton>
      </Box>

      {/* Tabs for Ongoing and Completed */}
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Ongoing Campaigns" />
        <Tab label="Completed Campaigns" />
      </Tabs>

      {/* Campaign Cards */}
      <Grid container spacing={4} mt={3}>
        {filteredCampaigns.map((campaign) => (
          <Grid item xs={12} md={6} lg={4} key={campaign._id}>
            <Card sx={{ borderRadius: "12px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {campaign.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {campaign.location}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Volunteers: {campaign.maxVolunteers}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {campaign.campaignStartDate} - {campaign.campaignEndDate}
                </Typography>
                <LinearProgress variant="determinate" value={50} sx={{ height: "8px", borderRadius: "4px", my: 2 }} />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleCampaignClick(campaign)}
                  sx={{ backgroundColor: theme.palette.primary.main }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <Dialog open={!!selectedCampaign} onClose={handleCloseModal} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedCampaign.title}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              {selectedCampaign.description}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Location: {selectedCampaign.location}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Volunteers: {selectedCampaign.maxVolunteers}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Registration: {selectedCampaign.registrationStartDate} - {selectedCampaign.registrationEndDate}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Campaign: {selectedCampaign.campaignStartDate} - {selectedCampaign.campaignEndDate}
            </Typography>

            <Box mt={3}>
              <Typography variant="h6">Milestones</Typography>
              <ul>
                {selectedCampaign.milestones.map((milestone, index) => (
                  <li key={index}>{milestone}</li>
                ))}
              </ul>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default CampaignPage;
