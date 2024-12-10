import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Alert,
  InputAdornment,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserImage from 'components/UserImage';

const AdminRole = ({ userId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userList, setUserList] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // New state for loading indicator

  const theme = useTheme();
  const { palette } = theme;
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    if (!token) {
      console.error('No token found in Redux state');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching users:', errorData.error || response.statusText);
        setLoading(false); // Set loading to false if there's an error
        return;
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Expected an array but received:', data);
        setLoading(false); // Set loading to false if there's an error
        return;
      }

      setUserList(data);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false); // Set loading to false if there's an error
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const filteredUsers = userList.filter(
    (user) =>
      (roleFilter === 'all' || user.role === roleFilter) &&
      (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const updateSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    
  };

  const changeUserRole = async (userId, newRole) => {
    if (!userId) {
      console.error('No user ID provided to changeUserRole.');
      return;
    }

    try {
      const endpoint = newRole === 'assistantAdmin' ? 'promote' : 'demote';
      const response = await fetch(`http://localhost:3001/admin/${endpoint}/${userId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to change user role:', errorData.error || response.statusText);
        return;
      }

      const updatedUser = await response.json();
      setUserList((prevList) =>
        prevList.map((user) => (user.id === userId ? updatedUser.user : user))
      );
      updateSnackbar(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error changing user role:', error);
    }
  };

  const toggleUserActiveStatus = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/toggle-user-status/${userId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      const { user, message } = await response.json();
      setUserList((prevList) =>
        prevList.map((item) => (item.id === user.id ? { ...item, isActive: user.isActive } : item))
      );

      updateSnackbar(message);
    } catch (error) {
      console.error('Error updating user status:', error);
      updateSnackbar('Failed to update user status. Please try again.');
    }
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <Box sx={{ padding: '2rem', minHeight: '100vh', borderRadius: '8px', backgroundColor: palette.background.default }}>
      <Typography variant="h4" mb={3} color={palette.neutral.dark}>
        Manage Roles
      </Typography>
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
        }}
        sx={{ mb: 3 }}
      />
      <Box display="flex" justifyContent="center" mb={3} gap={2}>
        {['all', 'assistantAdmin', 'user'].map((role) => (
          <Button
            key={role}
            variant={roleFilter === role ? 'contained' : 'outlined'}
            onClick={() => setRoleFilter(role)}
          >
            {role === 'all' ? 'All Users' : role === 'assistantAdmin' ? 'Assistant Admins' : 'Users'}
          </Button>
        ))}
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '60vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {filteredUsers.map((user) => (
    <TableRow key={user.id}>
      <TableCell>
        <UserImage image={user.picturePath} size="45px" />
      </TableCell>
      <TableCell>{user.fullName || 'Loading...'}</TableCell> {/* Use fullName or fallback */}
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>
        {user.role === 'user' && (
          <Button onClick={() => changeUserRole(user.id, 'assistantAdmin')}>Promote</Button>
        )}
        {user.role === 'assistantAdmin' && (
          <Button onClick={() => changeUserRole(user.id, 'user')}>Demote</Button>
        )}
        <Button
          onClick={() => toggleUserActiveStatus(user.id)}
          color={user.isActive ? 'error' : 'success'}
        >
          {user.isActive ? 'Deactivate' : 'Activate'}
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      )}

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

AdminRole.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default AdminRole;
