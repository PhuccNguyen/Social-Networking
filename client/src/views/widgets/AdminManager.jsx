import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  InputBase,
  IconButton,
  Avatar,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress,
  TextField,        // Add this import for TextField
  InputAdornment    // Add this import for InputAdornment
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { RadialBarChart, RadialBar, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { Search as SearchIcon } from "@mui/icons-material"; // Add this import for SearchIcon


// Fake data for assistantAdmins, users, and campaigns
const assistantAdmins = [
  { _id: "admin1", username: "AssistantAdmin 1", picturePath: "/assets/admin1.png" },
  { _id: "admin2", username: "AssistantAdmin 2", picturePath: "/assets/admin2.png" },
];

const users = [
  { _id: "user1", firstName: "John", lastName: "Doe", gender: "male" },
  { _id: "user2", firstName: "Jane", lastName: "Smith", gender: "female" },
  { _id: "user3", firstName: "Mark", lastName: "Brown", gender: "male" },
  { _id: "user4", firstName: "Emily", lastName: "Johnson", gender: "female" },
];

const campaigns = [
  {
    _id: "1",
    title: "Dọn rác bãi biển",
    campaignStartDate: "2024-10-01",
    campaignEndDate: "2024-10-15",
    status: "ongoing",
    progress: 50,
    createdBy: assistantAdmins[0],
    volunteerCount: 50,
    maleVolunteers: 30,
    femaleVolunteers: 20,
    volunteers: [users[0], users[1]],
  },
  {
    _id: "2",
    title: "Giúp đỡ trẻ em nghèo",
    campaignStartDate: "2024-09-01",
    campaignEndDate: "2024-09-30",
    status: "completed",
    progress: 100,
    createdBy: assistantAdmins[1],
    volunteerCount: 100,
    maleVolunteers: 60,
    femaleVolunteers: 40,
    volunteers: [users[2], users[3]],
  },
];


// Custom component for stat cards
const StatCard = ({ title, value, percentage, color, icon }) => (
  <Paper sx={{ padding: "1rem", display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '12px' }}>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{title}</Typography>
      <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{value}</Typography>
    </Box>
    <Box
      sx={{
        backgroundColor: color.bgColor,
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        color: color.textColor,
      }}
    >
      {icon}
      <Typography variant="body1" sx={{ ml: 0.5, fontWeight: 'bold' }}>
        {percentage}
      </Typography>
    </Box>
  </Paper>
);

// COLORS for charts
const COLORS = ['#0088FE', '#FFBB28'];

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState(campaigns);
  const [selectedCampaign, setSelectedCampaign] = useState(null); // Chiến dịch được chọn
  const navigate = useNavigate();
  const theme = useTheme(); // Initialize useTheme to access theme.palette
  const { palette } = useTheme();
  
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;


  // Calculated data
  const totalCampaigns = campaigns.length;
  const totalVolunteers = campaigns.reduce((acc, campaign) => acc + campaign.volunteerCount, 0);
  const totalRegisteredUsers = users.length;
  const totalRegisteredVolunteers = users.filter(user =>
    campaigns.some(campaign => campaign.volunteers.includes(user))
  ).length;

  // Handle campaign search
  const handleSearch = () => {
    const searchResults = campaigns.filter((campaign) =>
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) || campaign._id.includes(searchQuery)
    );
    setFilteredCampaigns(searchResults);
    setSelectedCampaign(null); // Reset selected campaign when performing a new search
  };

  // Custom BarChartIcon for representing the small bar chart, with dynamic colors
  const BarChartIcon = ({ fillColor }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="12" width="2" height="8" fill={fillColor} />
      <rect x="8" y="8" width="2" height="12" fill={fillColor} />
      <rect x="12" y="10" width="2" height="10" fill={fillColor} />
      <rect x="16" y="6" width="2" height="14" fill={fillColor} />
      <rect x="20" y="9" width="2" height="11" fill={fillColor} />
    </svg>
  );

  // Handle campaign click
  const handleCampaignClick = (campaign) => {
    setSelectedCampaign(campaign); // Display campaign progress details when clicked
  };

  // Handle admin click to view profile
  const handleAdminClick = (adminId) => {
    navigate(`/profile/${adminId}`);
  };

  return (
    <Box padding="2rem">
      {/* Display stat cards */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Campaigns"
            value={totalCampaigns}
            percentage="+10%"
            color={{ bgColor: "#E6F4EA", textColor: "#34A853" }}
            icon={<BarChartIcon fillColor="#34A853" />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Volunteers"
            value={totalVolunteers}
            percentage="-7%"
            color={{ bgColor: "#FCE8E6", textColor: "#EA4335" }}
            icon={<BarChartIcon fillColor="#EA4335" />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Registered Users"
            value={totalRegisteredUsers}
            percentage="~12%"
            color={{ bgColor: "#F3E5F5", textColor: "#9C27B0" }}
            icon={<BarChartIcon fillColor="#9C27B0" />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Registered Volunteers"
            value={totalRegisteredVolunteers}
            percentage="33%"
            color={{ bgColor: "#E3F2FD", textColor: "#2196F3" }}
            icon={<BarChartIcon fillColor="#2196F3" />}
          />
        </Grid>
      </Grid>

      {/* Campaign search */}
{/* Search Bar */}
<Box display="flex" justifyContent="flex-start" marginBottom="0rem" marginTop="2.5rem">
  <TextField
    label="Search Campaign"
    variant="outlined"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    fullWidth
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon sx={{ color: theme.palette.neutral.medium }} /> {/* Use medium color for the search icon */}
        </InputAdornment>
      ),
    }}
    sx={{
      backgroundColor: theme.palette.background.paper, // Use the paper background for contrast
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: theme.palette.neutral.medium, // Use medium color for the input border
        },
        "&:hover fieldset": {
          borderColor: theme.palette.neutral.dark, // Darker border on hover
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.primary.main, // Primary color when focused
        },
      },
    }}
  />
</Box>


{/* Display selected campaign progress */}
{selectedCampaign ? (
  <Box mt={4}>
    <Typography variant="h4" gutterBottom sx={{ color: dark }}>
      Campaign Progress: {selectedCampaign.title}
    </Typography>

    <Grid container spacing={4}>
      {/* RadialBarChart for campaign progress */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ padding: "1rem", borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: palette.background.default }}>
          <Typography variant="h6" sx={{ color: dark }}>Campaign Progress</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="90%"
              barSize={10}
              data={[{ name: 'Progress', progress: selectedCampaign.progress }]}
            >
              <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="progress" />
              <Legend />
            </RadialBarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* PieChart for volunteer ratio */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ padding: "1rem", borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: palette.background.default }}>
          <Typography variant="h6" sx={{ color: dark }}>Volunteer Ratio</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Male', value: selectedCampaign.maleVolunteers },
                  { name: 'Female', value: selectedCampaign.femaleVolunteers }
                ]}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill={palette.primary.main}
                label
              >
                {['Male', 'Female'].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* List of Volunteers */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ padding: "1rem", borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: palette.background.default }}>
          <Typography variant="h6" sx={{ color: dark }}>
            Volunteers ({selectedCampaign.volunteers.length})
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1rem', color: dark }}>
            {selectedCampaign.volunteers.map(volunteer => (
              <li key={volunteer._id} style={{ marginBottom: '0.5rem' }}>
                {volunteer.firstName} {volunteer.lastName}
              </li>
            ))}
          </ul>
        </Paper>
      </Grid>
    </Grid>
  </Box>
) : (
  <Box mt={4}>
    {/* Display a table with campaigns if no campaign is selected */}
    <Typography variant="h4" gutterBottom sx={{ color: dark }}>
      Campaign Details
    </Typography>
    <Table sx={{ backgroundColor: palette.background.paper, borderRadius: '8px' }}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ color: dark }}>ID</TableCell>
          <TableCell sx={{ color: dark }}>Campaign Title</TableCell>
          <TableCell sx={{ color: dark }}>Start Date</TableCell>
          <TableCell sx={{ color: dark }}>End Date</TableCell>
          <TableCell sx={{ color: dark }}>Status</TableCell>
          <TableCell sx={{ color: dark }}>Progress</TableCell>
          <TableCell sx={{ color: dark }}>Assistant Admin</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredCampaigns.map((campaign) => (
          <TableRow
            key={campaign._id}
            onClick={() => handleCampaignClick(campaign)}
            style={{ cursor: "pointer", transition: 'background-color 0.2s ease', '&:hover': { backgroundColor: palette.action.hover } }}
          >
            <TableCell sx={{ color: dark }}>{campaign._id}</TableCell>
            <TableCell sx={{ color: dark }}>{campaign.title}</TableCell>
            <TableCell sx={{ color: dark }}>{campaign.campaignStartDate}</TableCell>
            <TableCell sx={{ color: dark }}>{campaign.campaignEndDate}</TableCell>
            <TableCell sx={{ color: dark }}>{campaign.status}</TableCell>
            <TableCell>
              <LinearProgress variant="determinate" value={campaign.progress} sx={{ height: '8px', borderRadius: '4px', backgroundColor: palette.background.default }} />
            </TableCell>
            <TableCell>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdminClick(campaign.createdBy._id);
                }}
                style={{ textTransform: "none", color: main }}
              >
                <Avatar
                  src={campaign.createdBy.picturePath}
                  alt={campaign.createdBy.username}
                  sx={{ width: 30, height: 30, mr: 1 }}
                />
                {campaign.createdBy.username}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
)}



    </Box>
  );
};

export default AdminDashboard;
