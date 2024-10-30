import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Table, TableHead, TableBody, TableCell, TableRow, Button, Alert, InputAdornment, Snackbar
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import UserImage from "components/UserImage";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const AdminRole = ( userId ) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userList, setUserList] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const theme = useTheme();
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { palette } = theme;
  const token = useSelector((state) => state.token); // Get token from Redux state
  const navigate = useNavigate();

  const dark = palette.neutral.dark;
  const main = palette.neutral.main;

// Reusable fetchUsers function to load all users
const fetchUsers = async () => {
  if (!token) {
    console.error("No token found in Redux state");
    return;
  }

  try {
    const response = await fetch('http://localhost:3001/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching users:", errorData.error || response.statusText);
      return;
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error("Expected an array but received:", data);
      return;
    }

    // Update user list with fetched data, including isActive status
    setUserList(data);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// Call fetchUsers when component mounts
useEffect(() => {
  fetchUsers();
}, [token]);

// Filter users based on search query and role filter
const filteredUsers = userList.filter(user =>
  (roleFilter === 'all' || user.role === roleFilter) &&
  (
    (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )
);

  // Change user role function
const changeUserRole = async (userId, newRole) => {
  if (!userId) {
    console.error("No user ID provided to changeUserRole.");
    return;
  }

  try {
    const url = `http://localhost:3001/admin/${newRole === 'assistantAdmin' ? 'promote' : 'demote'}/${userId}`;
    console.log(`Sending request to URL: ${url}`);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const updatedUser = await response.json();
      setUserList(prevState =>
        prevState.map(user => (user.id === userId ? updatedUser.user : user))
      );
    } else {
      const errorData = await response.json();
      console.error("Failed to change user role:", errorData.error || response.statusText);
    }
  } catch (error) {
    console.error("Error changing user role:", error);
  }
};


// Toggle user active status
const toggleUserActiveStatus = async (userId) => {
  try {
    const response = await fetch(`http://localhost:3001/admin/toggle-user-status/${userId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update status");
    }

    const { message, user } = await response.json();

    // Immediately update the userList with the new isActive status
    setUserList((prevList) =>
      prevList.map((item) =>
        item.id === user.id ? { ...item, isActive: user.isActive } : item
      )
    );

    setSnackbarMessage(message); // Show a success message in the snackbar
  } catch (error) {
    console.error("Error updating user status:", error);
    setSnackbarMessage("Failed to update user status. Please try again.");
  }
  
  setSnackbarOpen(true); // Show the snackbar
};


  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box padding="2rem" sx={{ minHeight: "100vh", borderRadius: "8px", backgroundColor: palette.background.default }}>
      <Typography variant="h4" mb={3} color={dark}>Manage Roles</Typography>
      <TextField
        label="Search by Name or Email"
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
      <Box display="flex" justifyContent="center" mb={3} gap="1rem">
        {['all', 'assistantAdmin', 'user'].map(role => (
          <Button
            key={role}
            variant={roleFilter === role ? 'contained' : 'outlined'}
            onClick={() => setRoleFilter(role)}
            sx={{
              background: roleFilter === role ? "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)" : palette.background.paper,
              color: roleFilter === role ? '#fff' : main,
              padding: '0.5rem 2rem',
              borderRadius: '30px',
              '&:hover': {
                background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                color: '#fff',
              },
            }}
          >
            {role === 'all' ? 'All Users' : role === 'assistantAdmin' ? 'Assistant Admins' : 'Users'}
          </Button>
        ))}
      </Box>
      <Table sx={{ backgroundColor: palette.background.paper, borderRadius: '8px' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: dark }}>Avatar</TableCell>
            <TableCell sx={{ color: dark }}>Name</TableCell>
            <TableCell sx={{ color: dark }}>Email</TableCell>
            <TableCell sx={{ color: dark }}>Role</TableCell>
            <TableCell sx={{ color: dark }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map(user => (
             <TableRow key={user.id}>
             <TableCell>
                      <UserImage image={user.picturePath} size="45px" />
             </TableCell>            
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              
              <TableCell>
  {console.log(`User ID: ${user.id}, Role: ${user.role}`)}
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

              <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
              
              <TableCell>
                {user.role !== "admin" && (
                  <Button
                    variant="outlined"
                    color={user.isActive ? "error" : "success"}
                    onClick={() => toggleUserActiveStatus(user.id)}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </Button>
                )}
              </TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
       {/* Snackbar for feedback */}
       <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>


    </Box>
  );
};

export default AdminRole;
