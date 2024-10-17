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
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { RadialBarChart, RadialBar, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

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
  <Paper sx={{ padding: "1rem", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h3">{value}</Typography>
    </Box>
    <Box 
      sx={{ 
        backgroundColor: color.bgColor, 
        padding: '0.3rem 0.7rem', 
        borderRadius: '8px', 
        display: 'flex', 
        alignItems: 'center',
        color: color.textColor 
      }}
    >
      {icon}
      <Typography variant="body1" sx={{ ml: 0.5 }}>
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
      icon={<BarChartIcon fillColor="#34A853" />} // Dynamic color for the bar chart
    />
  </Grid>
  <Grid item xs={12} md={3}>
    <StatCard 
      title="Total Volunteers" 
      value={totalVolunteers} 
      percentage="-7%" 
      color={{ bgColor: "#FCE8E6", textColor: "#EA4335" }} 
      icon={<BarChartIcon fillColor="#EA4335" />} // Dynamic color for the bar chart
    />
  </Grid>
  <Grid item xs={12} md={3}>
    <StatCard 
      title="Registered Users" 
      value={totalRegisteredUsers} 
      percentage="~12%" 
      color={{ bgColor: "#F3E5F5", textColor: "#9C27B0" }} 
      icon={<BarChartIcon fillColor="#9C27B0" />}  // Dynamic color for the bar chart
    />
  </Grid>
  <Grid item xs={12} md={3}>
    <StatCard 
      title="Registered Volunteers" 
      value={totalRegisteredVolunteers} 
      percentage="33%" 
      color={{ bgColor: "#E3F2FD", textColor: "#2196F3" }} 
      icon={<BarChartIcon fillColor="#2196F3" />} // Dynamic color for the bar chart
    />
  </Grid>
</Grid>

      {/* Campaign search */}   
      <Box display="flex" alignItems="center" mt={4}>
        <InputBase
          placeholder="Tìm kiếm chiến dịch bằng ID hoặc tên..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "100%", backgroundColor: "#f0f0f0", padding: "0.5rem", borderRadius: "5px" }}
        />
        <IconButton onClick={handleSearch}>
          <Search />
        </IconButton>
      </Box>

      {/* Display selected campaign progress */}
      {selectedCampaign ? (
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            Tiến độ của chiến dịch: {selectedCampaign.title}
          </Typography>

          <Grid container spacing={4}>
            {/* RadialBarChart for campaign progress */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: "1rem" }}>
                <Typography variant="h6">Tiến độ chiến dịch</Typography>
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
              <Paper sx={{ padding: "1rem" }}>
                <Typography variant="h6">Tỷ lệ tình nguyện viên</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Nam', value: selectedCampaign.maleVolunteers },
                        { name: 'Nữ', value: selectedCampaign.femaleVolunteers }
                      ]}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {['Nam', 'Nữ'].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* List of Volunteers */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: "1rem" }}>
                <Typography variant="h6">
                  Danh sách Tình nguyện viên ({selectedCampaign.volunteers.length}) {/* Display total count */}
                </Typography>
                <ul>
                  {selectedCampaign.volunteers.map(volunteer => (
                    <li key={volunteer._id}>
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
          <Typography variant="h4" gutterBottom>
            Chi tiết Chiến dịch
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên Chiến dịch</TableCell>
                <TableCell>Ngày Bắt đầu</TableCell>
                <TableCell>Ngày Kết thúc</TableCell>
                <TableCell>Tình trạng</TableCell>
                <TableCell>Tiến độ</TableCell>
                <TableCell>Assistant Admin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow
                  key={campaign._id}
                  onClick={() => handleCampaignClick(campaign)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{campaign._id}</TableCell>
                  <TableCell>{campaign.title}</TableCell>
                  <TableCell>{campaign.campaignStartDate}</TableCell>
                  <TableCell>{campaign.campaignEndDate}</TableCell>
                  <TableCell>{campaign.status}</TableCell>
                  <TableCell>
                    <LinearProgress variant="determinate" value={campaign.progress} />
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdminClick(campaign.createdBy._id);
                      }}
                      style={{ textTransform: "none" }}
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
