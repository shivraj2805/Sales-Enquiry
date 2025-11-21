import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import useAuthStore from '../../store/authStore';
import axios from '../../utils/axios';

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      const response = await axios.put('/users/profile', {
        name: formData.name,
        email: formData.email,
        department: formData.department,
      });

      setUser(response.data.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await axios.put('/users/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSuccess('Password updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        My Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Profile Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              mr: 3,
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {user?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user?.role?.toUpperCase()} - {user?.department}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleUpdateProfile}>
          <Typography variant="h6" gutterBottom display="flex" alignItems="center">
            <PersonIcon sx={{ mr: 1 }} />
            Update Profile Information
          </Typography>

          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Role"
                value={user?.role?.toUpperCase()}
                disabled
                helperText="Contact administrator to change role"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Change Password */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleUpdatePassword}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                type="password"
                label="Current Password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                type="password"
                label="New Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                helperText="Minimum 6 characters"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                type="password"
                label="Confirm New Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Change Password'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Profile;
