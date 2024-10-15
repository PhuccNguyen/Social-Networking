import React, { useState } from "react";
import { Box, Typography, Grid, Paper, InputBase, IconButton, Avatar, Button, Table, TableHead, TableBody, TableRow, TableCell, LinearProgress } from "@mui/material";
import { Search } from "@mui/icons-material";
import { RadialBarChart, RadialBar, Legend, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

// Fake data cho AssistantAdmin và campaigns
const assistantAdmins = [
  { _id: "admin1", username: "AssistantAdmin 1", picturePath: "/assets/admin1.png" },
  { _id: "admin2", username: "AssistantAdmin 2", picturePath: "/assets/admin2.png" },
];

// Fake data cho Users
const users = [
  { _id: "user1", firstName: "John", lastName: "Doe", gender: "male" },
  { _id: "user2", firstName: "Jane", lastName: "Smith", gender: "female" },
  { _id: "user3", firstName: "Mark", lastName: "Brown", gender: "male" },
  { _id: "user4", firstName: "Emily", lastName: "Johnson", gender: "female" },
];

// Fake data cho campaigns
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

// Màu cho pie chart
const COLORS = ['#0088FE', '#FFBB28'];

// Component AdminDashboard
const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState(campaigns);
  const [selectedCampaign, setSelectedCampaign] = useState(null); // Chiến dịch được chọn
  const navigate = useNavigate();

  // Tổng số chiến dịch và tình nguyện viên
  const totalCampaigns = campaigns.length;
  const totalVolunteers = campaigns.reduce((acc, campaign) => acc + campaign.volunteerCount, 0);

  // Xử lý tìm kiếm chiến dịch bằng ID hoặc tên
  const handleSearch = () => {
    const searchResults = campaigns.filter((campaign) =>
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) || campaign._id.includes(searchQuery)
    );
    setFilteredCampaigns(searchResults);
    setSelectedCampaign(null); // Reset selected campaign khi tìm kiếm mới
  };

  // Xử lý khi click vào một chiến dịch
  const handleCampaignClick = (campaign) => {
    setSelectedCampaign(campaign); // Hiển thị chi tiết tiến độ chiến dịch khi click
  };

  // Xử lý khi click vào profile của AssistantAdmin
  const handleAdminClick = (adminId) => {
    navigate(`/profile/${adminId}`); // Điều hướng đến trang profile của AssistantAdmin
  };

  return (
    <Box padding="2rem">
      {/* Tổng số chiến dịch và tình nguyện viên */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: "1rem" }}>
            <Typography variant="h6">Tổng số Chiến dịch</Typography>
            <Typography variant="h3">{totalCampaigns}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: "1rem" }}>
            <Typography variant="h6">Tổng số Tình nguyện viên</Typography>
            <Typography variant="h3">{totalVolunteers}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tìm kiếm chiến dịch */}
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

      {/* Nếu đã chọn một chiến dịch, hiển thị chi tiết tiến độ của chiến dịch đó */}
      {selectedCampaign ? (
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            Tiến độ của chiến dịch: {selectedCampaign.title}
          </Typography>

          <Grid container spacing={4}>
            {/* Biểu đồ tiến độ (RadialBarChart) */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: "1rem" }}>
                <Typography variant="h6">Tiến độ chiến dịch</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" barSize={10} data={[{ name: 'Progress', progress: selectedCampaign.progress }]}>
                    <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="progress" />
                    <Legend />
                  </RadialBarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Tỷ lệ nam/nữ (PieChart) */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: "1rem" }}>
                <Typography variant="h6">Tỷ lệ tình nguyện viên</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={[
                      { name: 'Nam', value: selectedCampaign.maleVolunteers },
                      { name: 'Nữ', value: selectedCampaign.femaleVolunteers }
                    ]} dataKey="value" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                      {['Nam', 'Nữ'].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Danh sách tình nguyện viên */}
            <Grid item xs={12} md={4}>
  <Paper sx={{ padding: "1rem" }}>
    <Typography variant="h6">
      Danh sách Tình nguyện viên ({selectedCampaign.volunteers.length}) {/* Hiển thị tổng số lượng */}
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
          {/* Hiển thị bảng chiến dịch tổng quan */}
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
                <TableCell>AssistantAdmin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign._id} onClick={() => handleCampaignClick(campaign)} style={{ cursor: "pointer" }}>
                  <TableCell>{campaign._id}</TableCell>
                  <TableCell>{campaign.title}</TableCell>
                  <TableCell>{campaign.campaignStartDate}</TableCell>
                  <TableCell>{campaign.campaignEndDate}</TableCell>
                  <TableCell>{campaign.status}</TableCell>
                  <TableCell>
                    <LinearProgress variant="determinate" value={campaign.progress} />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleAdminClick(campaign.createdBy._id)} style={{ textTransform: 'none' }}>
                      <Avatar src={campaign.createdBy.picturePath} alt={campaign.createdBy.username} sx={{ width: 30, height: 30, mr: 1 }} />
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
