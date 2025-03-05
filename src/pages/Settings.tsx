import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  ListItemButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  CloudSync as CloudSyncIcon,
  Person as PersonIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  
  // User settings state
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [username, setUsername] = useState('Plant Lover');
  const [email, setEmail] = useState('user@example.com');
  
  // Dialog states
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'info' | 'warning' | 'error'
  });
  
  const handleProfileSave = () => {
    setOpenProfileDialog(false);
    setSnackbar({
      open: true,
      message: 'Profile updated successfully',
      severity: 'success'
    });
  };
  
  const handleDeleteAccount = () => {
    setOpenDeleteDialog(false);
    // In a real app, this would delete the user's account
    setSnackbar({
      open: true,
      message: 'Account deleted',
      severity: 'info'
    });
    // Navigate to login after account deletion
    setTimeout(() => navigate('/login'), 1500);
  };
  
  const handleLogout = () => {
    setOpenLogoutDialog(false);
    // In a real app, this would log the user out
    setSnackbar({
      open: true,
      message: 'Logged out successfully',
      severity: 'info'
    });
    // Navigate to login after logout
    setTimeout(() => navigate('/login'), 1500);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* Top App Bar */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: '#4CAF50' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ color: 'white' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white', fontWeight: 'bold' }}>
            Settings
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Profile Section */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 64, 
                height: 64, 
                bgcolor: '#4CAF50',
                mr: 2
              }}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{username}</Typography>
              <Typography variant="body2" color="text.secondary">{email}</Typography>
            </Box>
            <IconButton color="primary" onClick={() => setOpenProfileDialog(true)}>
              <EditIcon />
            </IconButton>
          </Box>
        </Paper>

        {/* App Settings */}
        <Paper sx={{ mb: 2, borderRadius: 2 }}>
          <List disablePadding>
            <ListItem>
              <ListItemIcon>
                <DarkModeIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Dark Mode" 
                secondary="Use dark theme throughout the app"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Notifications" 
                secondary="Receive watering and care reminders"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            <ListItem>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Language" 
                secondary="Choose your preferred language"
              />
              <ListItemSecondaryAction>
                <FormControl variant="standard" sx={{ minWidth: 120 }}>
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as string)}
                    size="small"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                  </Select>
                </FormControl>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        {/* Data & Privacy */}
        <Paper sx={{ mb: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ p: 2, pb: 0, fontWeight: 'bold' }}>
            Data & Privacy
          </Typography>
          
          <List disablePadding>
            <ListItem component="div">
              <ListItemButton>
                <ListItemIcon>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Data Storage" 
                  secondary="Manage your plant data storage"
                />
              </ListItemButton>
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            <ListItem component="div">
              <ListItemButton>
                <ListItemIcon>
                  <CloudSyncIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Sync Data" 
                  secondary="Sync your data across devices"
                />
              </ListItemButton>
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            <ListItem component="div">
              <ListItemButton>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Privacy Settings" 
                  secondary="Manage your privacy preferences"
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>

        {/* Help & Support */}
        <Paper sx={{ mb: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ p: 2, pb: 0, fontWeight: 'bold' }}>
            Help & Support
          </Typography>
          
          <List disablePadding>
            <ListItem component="div">
              <ListItemButton>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Help Center" 
                  secondary="Get help with using the app"
                />
              </ListItemButton>
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            <ListItem component="div">
              <ListItemButton>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="About" 
                  secondary="App version 1.0.0"
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>

        {/* Account Actions */}
        <Paper sx={{ borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ p: 2, pb: 0, fontWeight: 'bold' }}>
            Account
          </Typography>
          
          <List disablePadding>
            <ListItem component="div">
              <ListItemButton onClick={() => setOpenLogoutDialog(true)}>
                <ListItemIcon>
                  <LogoutIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout" 
                  secondary="Sign out of your account"
                />
              </ListItemButton>
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            <ListItem component="div">
              <ListItemButton onClick={() => setOpenDeleteDialog(true)}>
                <ListItemIcon>
                  <DeleteIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Delete Account" 
                  secondary="Permanently delete your account and data"
                  primaryTypographyProps={{ color: 'error' }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>
      </Box>

      {/* Profile Edit Dialog */}
      <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProfileDialog(false)}>Cancel</Button>
          <Button onClick={handleProfileSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Logout Dialog */}
      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout} variant="contained" color="primary">Logout</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings; 