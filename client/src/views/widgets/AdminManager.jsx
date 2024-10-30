import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import { RadialBarChart, RadialBar, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Search as SearchIcon } from "@mui/icons-material";
import UserImage from "components/UserImage";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

const COLORS = ["#0088FE", "#FFBB28"];

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [assistantAdmins, setAssistantAdmins] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [totalStats, setTotalStats] = useState({
    totalCampaigns: 0,
    totalVolunteers: 0,
    totalRegisteredUsers: 0,
    totalRegisteredVolunteers: 0,
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const { palette } = theme;
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);

  const dark = palette.neutral.dark;
  const main = palette.neutral.main;

  // Fetch assistant admins and campaigns from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:3001/admin/assistant-admins-campaigns", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setAssistantAdmins(data.assistantAdmins);
          setFilteredCampaigns(data.campaigns);

          const totalVolunteers = data.campaigns.reduce((acc, campaign) => acc + campaign.volunteerCount, 0);
          setTotalStats({
            totalCampaigns: data.campaigns.length,
            totalVolunteers: totalVolunteers,
            totalRegisteredUsers: data.assistantAdmins.length + data.campaigns.length,
            totalRegisteredVolunteers: totalVolunteers,
          });
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Handle campaign search
  const handleSearch = () => {
    const searchResults = filteredCampaigns.filter((campaign) =>
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCampaigns(searchResults);
    setSelectedCampaign(null);
  };

  const handleCampaignClick = (campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleAdminClick = (adminId) => {
    navigate(`/profile/${adminId}`);
  };

  const StatCard = ({ title, value, change, changeType }) => (
    <Paper
      sx={{
        padding: "1rem",
        borderRadius: "12px",
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: changeType === "increase" ? "#00C49F" : "#FF6347",
            fontWeight: "bold",
          }}
        >
          {changeType === "increase" ? "+" : "-"}{change} Since last week
        </Typography>
      </Box>
      <ResponsiveContainer width={70} height={70}>
        <PieChart>
          <Pie
            data={[{ value: 75 }, { value: 25 }]} // Example data for chart
            dataKey="value"
            innerRadius={25}
            outerRadius={35}
            startAngle={90}
            endAngle={-270}
            paddingAngle={5}
          >
            <Cell fill="#00C49F" />
            <Cell fill="#FFBB28" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );

  const BarChartIcon = ({ fillColor }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="12" width="2" height="8" fill={fillColor} />
      <rect x="8" y="8" width="2" height="12" fill={fillColor} />
      <rect x="12" y="10" width="2" height="10" fill={fillColor} />
      <rect x="16" y="6" width="2" height="14" fill={fillColor} />
      <rect x="20" y="9" width="2" height="11" fill={fillColor} />
    </svg>
  );

  return (
    <Box padding="2rem">  
       <Grid container spacing={4}>
        <Grid item xs={12} md={3.6}>
          <StatCard
            title="Total Campaigns"
            value={totalStats.totalCampaigns}
            change="10%"
            changeType="increase"
          />
        </Grid>
        <Grid item xs={12} md={3.6}>
          <StatCard
            title="Registered Users"
            value={totalStats.totalRegisteredUsers}
            change="5%"
            changeType="decrease"
          />
        </Grid>
        <Grid item xs={12} md={4.1}>
          <StatCard
            title="Registered Volunteers"
            value={totalStats.totalRegisteredVolunteers}
            change="8%"
            changeType="increase"
          />
        </Grid>
      </Grid>
       {/* Enhanced Search Bar */}
<Box 
  display="flex" 
  alignItems="center" 
  color= '#fff'
  justifyContent="center" 
  mt={4} 
  mb={2} 
  sx={{
    padding: '1rem',
    borderRadius: '12px',
    backgroundColor: palette.background.default, // Background color adjusts with theme
    color: palette.text.primary, // Text color adjusts with theme

  }}
>
  <TextField
    placeholder="What are you looking for?"
    variant="outlined"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
    sx={{
      backgroundColor: palette.background.default, // Background color adjusts with theme
      color: palette.text.primary, // Text color adjusts with theme
      borderRadius: '8px',
      width: '40%', // Adjust width for a smaller size compared to the full width
      mr: 2,
    }}
  />
  <TextField
    placeholder="Location" // Secondary input field for location
    variant="outlined"
    sx={{
      backgroundColor: palette.background.default, // Background color adjusts with theme
      color: palette.text.primary, // Text color adjusts with theme
      borderRadius: '8px',
      width: '40%',
      mr: 2,
    }}
  />
  <Button 
    onClick={handleSearch} 
    variant="contained" 
    sx={{
      backgroundColor: '#3b82f6', // Blue color for button
      color: '#fff',
      padding: '0.75rem 2rem', // Larger padding for emphasis
      fontWeight: 'bold',
      textTransform: 'none',
      '&:hover': {
        backgroundColor: '#2563eb', // Darker shade on hover
      },
    }}
  >
    Search
  </Button>
</Box>


      {selectedCampaign ? (
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            Campaign Progress: {selectedCampaign.title}
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart data={[{ name: "Progress", progress: selectedCampaign.progress }]}>
                  <RadialBar minAngle={15} background clockWise dataKey="progress" />
                  <Legend />
                </RadialBarChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={4}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Male", value: selectedCampaign.maleVolunteers },
                      { name: "Female", value: selectedCampaign.femaleVolunteers },
                    ]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {["Male", "Female"].map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            Campaign Details
          </Typography>
          <Table sx={{ backgroundColor: palette.background.paper, borderRadius: "8px" }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Campaign Title</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Assistant Admin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign._id} onClick={() => handleCampaignClick(campaign)}>
                  <TableCell>{campaign._id}</TableCell>
                  <TableCell>{campaign.title}</TableCell>
                  <TableCell>{campaign.campaignStartDate}</TableCell>
                  <TableCell>{campaign.campaignEndDate}</TableCell>
                  <TableCell>{campaign.status}</TableCell>
                  <TableCell>
                    <LinearProgress variant="determinate" value={campaign.progress} sx={{ height: "8px" }} />
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdminClick(campaign.createdBy._id);
                      }}
                      style={{ textTransform: "none", color: main }}
                    >
                      <UserImage image={campaign.createdBy.picturePath} alt={campaign.createdBy.username} size="45px" />

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
