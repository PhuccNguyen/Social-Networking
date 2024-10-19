import React, { useState } from 'react';
import { Box, Typography, TextField, Table, TableHead, TableBody, TableCell, TableRow, Button, IconButton, Avatar, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles'; // Import useTheme to access theme context
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Fake users for demo purposes
const fakeUsers = Array.from({ length: 20 }, (_, index) => ({
  id: `user${index + 1}`,
  name: `User ${index + 1}`,
  email: `user${index + 1}@ex.com`,
  role: index % 2 === 0 ? 'user' : 'assistantAdmin',
  lastLogin: new Date().toLocaleString(),
  picturePath: `/assets/user${index + 1}.png`,
}));

const ManageRoles = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userList, setUserList] = useState(fakeUsers);
  const [roleFilter, setRoleFilter] = useState('all');
  const navigate = useNavigate(); // Initialize the navigate function

  const theme = useTheme(); // Get theme for dynamic colors
  const { palette } = theme;


  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  // Filter users based on search query and role filter
  const filteredUsers = userList.filter(user =>
    (roleFilter === 'all' || user.role === roleFilter) &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handler to change the role of a user
  const changeUserRole = (userId, newRole) => {
    setUserList(prevState =>
      prevState.map(user => (user.id === userId ? { ...user, role: newRole } : user))
    );
  };

  return (
    <Box padding="2rem" sx={{ minHeight: "100vh", borderRadius: "8px", backgroundColor: palette.background.default }}>
      {/* Page Title */}
      <Typography variant="h4" mb={3} color={dark}>
        Manage Roles
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search by Name, Email, or ID"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          style: { backgroundColor: palette.background.paper, borderRadius: '8px', color: dark },
        }}
        sx={{ marginBottom: '1.5rem' }}
      />

      {/* Filter Buttons */}
      <Box display="flex" justifyContent="center" mb={3} gap="1rem">
        <Button
          variant={roleFilter === 'all' ? 'contained' : 'outlined'}
          onClick={() => setRoleFilter('all')}
          sx={{
            background: roleFilter === 'all' ? "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)" : palette.background.paper,
            color: roleFilter === 'all' ? '#fff' : main,
            padding: '0.5rem 2rem',
            borderRadius: '30px',
            border: roleFilter === 'all' ? 'none' : `1px solid ${main}`,
            '&:hover': {
              background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
              color: '#fff',
            },
          }}
        >
          All Users
        </Button>
        <Button
          variant={roleFilter === 'assistantAdmin' ? 'contained' : 'outlined'}
          onClick={() => setRoleFilter('assistantAdmin')}
          sx={{
            background: roleFilter === 'assistantAdmin' ? "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)" : palette.background.paper,
            color: roleFilter === 'assistantAdmin' ? '#fff' : main,
            padding: '0.5rem 2rem',
            borderRadius: '30px',
            border: roleFilter === 'assistantAdmin' ? 'none' : `1px solid ${main}`,
            '&:hover': {
              background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
              color: '#fff',
            },
          }}
        >
          Assistant Admins
        </Button>
        <Button
          variant={roleFilter === 'user' ? 'contained' : 'outlined'}
          onClick={() => setRoleFilter('user')}
          sx={{
            background: roleFilter === 'user' ? "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)" : palette.background.paper,
            color: roleFilter === 'user' ? '#fff' : main,
            padding: '0.5rem 2rem',
            borderRadius: '30px',
            border: roleFilter === 'user' ? 'none' : `1px solid ${main}`,
            '&:hover': {
              background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
              color: '#fff',
            },
          }}
        >
          Users
        </Button>
      </Box>

      {/* User Table */}
      {/* User Table */}
      <Table sx={{ backgroundColor: palette.background.paper, borderRadius: '8px' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: dark }}>Avatar</TableCell>
            <TableCell sx={{ color: dark }}>Name</TableCell>
            <TableCell sx={{ color: dark }}>Email</TableCell>
            <TableCell sx={{ color: dark }}>Role</TableCell>
            <TableCell sx={{ color: dark }}>Last Login</TableCell>
            <TableCell sx={{ color: dark }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow
              key={user.id}
              hover
              sx={{ cursor: 'pointer' }} // Show pointer to indicate the row is clickable
              onClick={() => navigate(`/profile/${user.id}`)} // Navigate to user's profile on row click
            >
              <TableCell>
                <Avatar src={user.picturePath} />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.lastLogin}</TableCell>
              <TableCell
                onClick={(e) => e.stopPropagation()} // Prevent row click when interacting with buttons
              >
                {user.role === 'user' && (
                  <Button
                    variant="outlined"
                    onClick={() => changeUserRole(user.id, 'assistantAdmin')}
                    sx={{ color: palette.success.main, borderColor: palette.success.main }}
                  >
                    Promote to AssistantAdmin
                  </Button>
                )}
                {user.role === 'assistantAdmin' && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => changeUserRole(user.id, 'user')}
                    sx={{ color: palette.error.main, borderColor: palette.error.main }}
                  >
                    Demote to User
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ManageRoles;
