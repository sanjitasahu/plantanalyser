import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  CardActionArea,
  Box, 
  TextField,
  InputAdornment,
  Paper,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  AppBar,
  Toolbar,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material';
import { 
  LocalFlorist as PlantIcon, 
  CameraAlt as CameraIcon, 
  Search as SearchIcon, 
  Add as AddIcon,
  SmartToy as AIIcon,
  Spa as DiagnoseIcon,
  Forum as ExpertsIcon,
  Yard as GardenIcon,
  NotificationsActive as RemindersIcon,
  ChevronRight as ChevronRightIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  LocalFlorist as LocalFloristIcon,
  AddCircle as AddCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { usePlants } from '../context/PlantContext';
import { useAuth } from '../context/AuthContext';
import { useAnalysis } from '../context/AnalysisContext';

// Removed books data

const Dashboard: React.FC = () => {
  const { plants } = usePlants();
  const { user } = useAuth();
  const { clearCurrentAnalysis } = useAnalysis();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Function to handle navigation to camera/analyze
  const handleNavigateToAnalyze = () => {
    clearCurrentAnalysis(); // Clear any previous analysis data
    navigate('/camera');
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pb: 8 }}>
      {/* Top App Bar */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 'none', borderBottom: '1px solid #f0f0f0' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#333' }}>
            Plant Analyzer
          </Typography>
          <IconButton 
            color="inherit" 
            aria-label="settings"
            onClick={() => navigate('/settings')}
            sx={{ color: '#666' }}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 2 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Hello, {user?.name || 'Plant Lover'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            What would you like to do today?
          </Typography>
        </Box>

        {/* Search Bar */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 1, 
            mb: 3, 
            display: 'flex', 
            alignItems: 'center',
            borderRadius: 2,
            border: '1px solid #e0e0e0'
          }}
        >
          <InputAdornment position="start" sx={{ pl: 1 }}>
            <SearchIcon color="action" />
          </InputAdornment>
          <TextField
            fullWidth
            placeholder="Search plants..."
            variant="standard"
            InputProps={{
              disableUnderline: true,
            }}
          />
        </Paper>

        {/* Quick Actions */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Quick Actions
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  bgcolor: '#E8F5E9', 
                  height: '100%',
                  boxShadow: 'none'
                }}
              >
                <CardActionArea 
                  sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  onClick={handleNavigateToAnalyze}
                >
                  <CameraIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                    Identify Plant
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
            
            <Grid item xs={6}>
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  bgcolor: '#E3F2FD', 
                  height: '100%',
                  boxShadow: 'none'
                }}
              >
                <CardActionArea 
                  sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  onClick={() => navigate('/plants')}
                >
                  <PlantIcon sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                    My Garden
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Features */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={4} sm={4}>
              <Box 
                component={Link} 
                to="/camera"
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Avatar sx={{ bgcolor: '#E8EAF6', color: '#3F51B5', mb: 1 }}>
                  <ExpertsIcon />
                </Avatar>
                <Typography variant="caption" align="center">Experts</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={4} sm={4}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Avatar sx={{ bgcolor: '#E8F5E9', color: '#4CAF50', mb: 1 }}>
                  <RemindersIcon />
                </Avatar>
                <Typography variant="caption" align="center">Reminders</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Get Started Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Get Started
          </Typography>
          
          <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height={150}
              image="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FyZGVufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
              alt="Garden"
            />
            <CardContent sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Start by adding your first plant or identifying a new one with our camera feature.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Plants */}
        {plants.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                My Plants
              </Typography>
              <Box 
                component={Link} 
                to="/plants"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: '#4CAF50'
                }}
              >
                <Typography variant="body2">View All</Typography>
                <ChevronRightIcon fontSize="small" />
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              {plants.slice(0, 3).map((plant) => (
                <Grid item xs={4} key={plant.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      boxShadow: 'none', 
                      borderRadius: 2,
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <CardActionArea 
                      sx={{ height: '100%' }}
                      onClick={() => navigate(`/plants/${plant.id}`)}
                    >
                      <CardMedia
                        component="img"
                        height={100}
                        image={plant.imageUrl || plant.images[0] || 'https://via.placeholder.com/100x100?text=Plant'}
                        alt={plant.name}
                      />
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                          {plant.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Bottom Navigation */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0,
          zIndex: 1000
        }} 
        elevation={3}
      >
        <BottomNavigation showLabels>
          <BottomNavigationAction 
            label="Home" 
            icon={<HomeIcon />} 
            component={Link}
            to="/"
          />
          <BottomNavigationAction 
            label="My Plants" 
            icon={<LocalFloristIcon />} 
            component={Link}
            to="/plants"
          />
          <BottomNavigationAction 
            label="Add" 
            icon={<AddCircleIcon color="primary" sx={{ fontSize: 32 }} />} 
            onClick={handleNavigateToAnalyze}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Dashboard; 