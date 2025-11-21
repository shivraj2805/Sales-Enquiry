import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Assessment as ReportIcon,
  AccountCircle,
  Logout,
} from '@mui/icons-material';
import useAuthStore from '../../store/authStore';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Enquiries', icon: <AssignmentIcon />, path: '/enquiries' },
  { text: 'Users', icon: <PeopleIcon />, path: '/users', roles: ['admin', 'management'] },
  { text: 'Reports', icon: <ReportIcon />, path: '/reports' },
];

const Layout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)' }}>
      <Toolbar sx={{ py: 2, background: 'rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon sx={{ color: 'white', fontSize: 32 }} />
          <Box>
            <Typography variant="h6" noWrap sx={{ color: 'white', fontWeight: 700, lineHeight: 1 }}>
              Sales Hub
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Enquiry System
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ px: 2, pt: 2 }}>
        {menuItems.map((item) => {
          // Check if user has permission to view this menu item
          if (item.roles && !item.roles.includes(user?.role)) {
            return null;
          }
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  color: 'rgba(255,255,255,0.9)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ 
        position: 'absolute', 
        bottom: 20, 
        left: 0, 
        right: 0, 
        px: 3,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center'
      }}>
        <Typography variant="caption">
          FCL © 2025
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 600 }}>
            Sales Enquiry Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                {user?.role}
              </Typography>
            </Box>
            <IconButton onClick={handleMenuClick}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
              }
            }}
          >
            <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ mt: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
