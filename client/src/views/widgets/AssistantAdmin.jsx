import React, { useState } from 'react';
import {
  Box, Typography, TextField, Grid, Card, CardContent, Avatar, IconButton, InputAdornment, Button, Dialog, DialogTitle, DialogContent,
  Table, TableHead, TableBody, TableRow, TableCell
} from "@mui/material";
import { Search as SearchIcon, ManageAccounts as ManageIcon } from "@mui/icons-material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';

// Fake data for Assistant Admins
const assistantAdmins = Array.from({ length: 20 }, (_, index) => ({
  id: `admin${index + 1}`,
  name: `Assistant Admin ${index + 1}`,
  email: `admin${index + 1}@ex.com`,
  campaignsContributed: Math.floor(Math.random() * 100) + 1, // Random number of campaigns
  picturePath: `/assets/admin${index + 1}.png`,
}));

// Fake Data for Campaigns
const campaignData = [
  { id: 1, title: "Campaign 1", status: "completed", description: "Beach Cleanup", createdBy: "admin1", location: "Beach", maxVolunteers: 100 },
  { id: 2, title: "Campaign 2", status: "ongoing", description: "Tree Planting", createdBy: "admin1", location: "Park", maxVolunteers: 50 },
  { id: 3, title: "Campaign 3", status: "completed", description: "Food Distribution", createdBy: "admin2", location: "Community Center", maxVolunteers: 150 },
  { id: 4, title: "Campaign 4", status: "ongoing", description: "Health Camp", createdBy: "admin2", location: "City Center", maxVolunteers: 75 },
];

// Assistant Admin Management Component
const AssistantAdminManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const theme = useTheme();

  // Filter Assistant Admins by search query
  const filteredAdmins = assistantAdmins.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pie Chart data
  const completedCampaigns = campaignData.filter(campaign => campaign.status === "completed").length;
  const ongoingCampaigns = campaignData.filter(campaign => campaign.status === "ongoing").length;

  const pieData = [
    { name: "Completed Campaigns", value: completedCampaigns },
    { name: "Ongoing Campaigns", value: ongoingCampaigns },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  // Open Dialog when Manage button is clicked
  const handleOpenDialog = (admin) => {
    setSelectedAdmin(admin);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAdmin(null);
  };

  return (
    <Box padding="2rem">
      {/* Title Section */}
      <Typography variant="h4" color={theme.palette.primary.main} fontWeight="600" marginBottom="1.5rem">
        Assistant Admin Management
      </Typography>

      {/* Total Assistant Admins */}
      <Typography variant="h6" color={theme.palette.text.primary} marginBottom="1.5rem">
        Total Assistant Admins: {assistantAdmins.length}
      </Typography>

      {/* Search Bar */}
      <Box display="flex" justifyContent="flex-start" marginBottom="1.5rem">
        <TextField
          label="Search Assistant Admins"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '8px' }}
        />
      </Box>

      {/* List of Assistant Admins */}
      <Grid container spacing={4}>
        {filteredAdmins.map(admin => (
          <Grid item xs={12} sm={6} md={4} key={admin.id}>
            <Card sx={{ display: 'flex', alignItems: 'center', padding: '1rem', borderRadius: '12px', boxShadow: 3 }}>
              <Avatar
                src={admin.picturePath}
                alt={admin.name}
                sx={{ width: 80, height: 80, marginRight: '1rem' }}
              />
              <CardContent>
                <Typography variant="h6" color={theme.palette.text.primary} fontWeight="500">
                  {admin.name}
                </Typography>
                <Typography variant="body2" color={theme.palette.text.secondary}>
                  {admin.email}
                </Typography>
                <Typography variant="body2" color={theme.palette.text.secondary}>
                  Campaigns Contributed: {admin.campaignsContributed}
                </Typography>
              </CardContent>

              <IconButton aria-label="manage" color="primary" sx={{ marginLeft: 'auto' }} onClick={() => handleOpenDialog(admin)}>
                <ManageIcon />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog khi nhấn nút Manage */}
      {selectedAdmin && (
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle>{selectedAdmin.name}'s Campaigns</DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              Campaign Statistics
            </Typography>

            {/* Pie Chart for Campaigns */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', height: 350, padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
  <ResponsiveContainer width="80%" height="100%">
    <PieChart>
      <Pie
        data={pieData}
        cx="50%"
        cy="45%" // Adjusted to center it vertically
        innerRadius={70} // Added inner radius for donut chart effect
        outerRadius={120}
        fill="#8884d8"
        dataKey="value"
        label={({ name, value }) => `${name}: ${value}`}
        labelLine={false}
        paddingAngle={5} // Adds spacing between segments
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend 
        layout="horizontal" 
        verticalAlign="bottom" 
        align="center" 
        iconSize={18} // Increase icon size for better visibility
        height={50} 
        wrapperStyle={{ marginTop: '20px' }} // Adds space between chart and legend
      />
    </PieChart>
  </ResponsiveContainer>
</Box>


            {/* Bảng chi tiết chiến dịch */}
            <Typography variant="h6" gutterBottom>
              Campaign Details
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Max Volunteers</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaignData
                  .filter(campaign => campaign.createdBy === selectedAdmin.id)
                  .map(campaign => (
                    <TableRow key={campaign.id}>
                      <TableCell>{campaign.title}</TableCell>
                      <TableCell>{campaign.status}</TableCell>
                      <TableCell>{campaign.location}</TableCell>
                      <TableCell>{campaign.maxVolunteers}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <Box display="flex" justifyContent="flex-end" marginTop="2rem">
              <Button onClick={handleCloseDialog} variant="contained" color="primary">
                Close
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default AssistantAdminManagement;
