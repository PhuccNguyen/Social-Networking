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
import { RadialBarChart, RadialBar,BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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
       <Grid container spacing={3}>
        <Grid item xs={12} md={3.7}>
          <StatCard
            title="Total Campaigns"
            value={totalStats.totalCampaigns}
            change="10%"
            changeType="increase"
          />
        </Grid>
        <Grid item xs={12} md={3.7}>
          <StatCard
            title="Registered Users"
            value={totalStats.totalRegisteredUsers}
            change="5%"
            changeType="decrease"
          />
        </Grid>
        <Grid item xs={12} md={4.5}>
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
  justifyContent="center" 
  mt={4} 
  mb={2} 
  sx={{
    padding: '1rem',
    borderRadius: '12px',
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
      backgroundColor: palette.background.paper,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",

      borderRadius: '8px',
      width: '40%', // Adjust width for a smaller size compared to the full width
      mr: 2,
    }}
  />
  <TextField
    placeholder="Location" // Secondary input field for location
    variant="outlined"
    sx={{
      backgroundColor: palette.background.paper,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",

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
  <Typography variant="h4" gutterBottom>Campaign Progress: {selectedCampaign.title}</Typography>

  {/* Basic Campaign Information */}
  <Grid container spacing={4}>
    <Grid item xs={12} md={6}>
      <StatCard title="Goal" value={selectedCampaign.goal || "N/A"} />
    </Grid>
    <Grid item xs={12} md={6}>
      <StatCard title="Status" value={selectedCampaign.status || "N/A"} />
    </Grid>
    <Grid item xs={12} md={6}>
      <StatCard title="Total Volunteers" value={selectedCampaign.totalVolunteers || "N/A"} />
    </Grid>
    <Grid item xs={12} md={6}>
      <StatCard title="Progress" value={`${selectedCampaign.progress || 0}%`} />
    </Grid>
  </Grid>

  {/* Milestones Section */}
  <Box mt={4}>
    <Typography variant="h5" gutterBottom>Milestones</Typography>
    {selectedCampaign.milestones && selectedCampaign.milestones.length > 0 ? (
      <Grid container spacing={3}>
        {selectedCampaign.milestones.map((milestone, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper sx={{ padding: "1rem", borderRadius: "12px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
              <Typography variant="h6">{milestone.name}</Typography>
              <Typography variant="body2" color="textSecondary">{milestone.description}</Typography>
              <Typography variant="body1">Progress: {milestone.percentage}%</Typography>
              <Typography variant="body2" color={milestone.completed ? "success.main" : "error.main"}>
                {milestone.completed ? "Completed" : "In Progress"}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    ) : (
      <Typography variant="body1">No milestones available</Typography>
    )}
  </Box>

  {/* Analysis Charts */}
  <Grid container spacing={4} mt={4}>

    {/* Milestone Completion Bar Chart */}
    <Grid item xs={12} md={6}>
      <Paper sx={{ padding: "1rem", borderRadius: "12px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Typography variant="h6" gutterBottom>Milestone Completion</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={selectedCampaign.milestones}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="percentage" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Grid>

    {/* Volunteer Engagement Over Time Line Chart */}
    <Grid item xs={12} md={6}>
      <Paper sx={{ padding: "1rem", borderRadius: "12px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Typography variant="h6" gutterBottom>Volunteer Engagement Over Time</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={selectedCampaign.engagementData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="volunteers" stroke="#0088FE" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Grid>

    {/* Volunteer Demographics Pie Chart */}
    <Grid item xs={12} md={6}>
      <Paper sx={{ padding: "1rem", borderRadius: "12px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Typography variant="h6" gutterBottom>Volunteer Demographics</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={selectedCampaign.demographics} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
              {selectedCampaign.demographics.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Grid>

    {/* Volunteer Location Distribution (Example) */}
    <Grid item xs={12} md={6}>
      <Paper sx={{ padding: "1rem", borderRadius: "12px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Typography variant="h6" gutterBottom>Volunteer Distribution by Location</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={selectedCampaign.locationDistribution}>
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ffbb28" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Grid>

  </Grid>
</Box>

      ) : (
        <Box mt={4}>
        <Typography variant="h4" gutterBottom>Campaign Overview</Typography>
        <Table sx={{ backgroundColor: palette.background.paper, borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Start Date</strong></TableCell>
              <TableCell><strong>End Date</strong></TableCell>
              <TableCell><strong>Progress</strong></TableCell>
              <TableCell><strong>Total Volunteers</strong></TableCell>
              <TableCell><strong>Admin</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCampaigns.map((campaign) => (
              <TableRow 
                key={campaign._id} 
                hover 
                onClick={() => handleCampaignClick(campaign)}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: palette.action.hover }
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {campaign._id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{campaign.title}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(campaign.campaignStartDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(campaign.campaignEndDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell width="150px">
                  <Box display="flex" alignItems="center">
                    <LinearProgress 
                      variant="determinate" 
                      value={campaign.progress} 
                      sx={{
                        height: "8px", 
                        borderRadius: "5px", 
                        width: "100%", 
                        bgcolor: palette.grey[200],
                        "& .MuiLinearProgress-bar": {
                          bgcolor: campaign.progress > 80 ? palette.success.main : palette.warning.main
                        }
                      }} 
                    />
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      {campaign.progress}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: palette.info.main }}>
                    {campaign.totalVolunteers || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={(e) => { e.stopPropagation(); handleAdminClick(campaign.createdBy._id); }}
                    style={{ textTransform: "none", color: palette.primary.main }}
                    startIcon={<UserImage image={campaign.createdBy.picturePath} alt={campaign.createdBy.username} size="30px" />}
                  >
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
