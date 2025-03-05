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
  MenuBook as BookIcon,
  Spa as DiagnoseIcon,
  ViewInAr as IdentifyIcon,
  Forum as ExpertsIcon,
  Workspaces as PremiumIcon,
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

// Sample book data
const books = [
  {
    id: 1,
    title: 'Flower of the Week',
    image: 'https://images.unsplash.com/photo-1589994160839-163cd867cfe8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHllbGxvdyUyMHR1bGlwfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 2,
    title: 'A Complete Guide to Gardening',
    image: 'https://images.unsplash.com/photo-1558429498-b67f75df4cf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9zZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 3,
    title: 'A Full Guide to Popular House Plants',
    image: 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2UlMjBwbGFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
];

const Dashboard: React.FC = () => {
  const { plants } = usePlants();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

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

      <Container maxWidth="lg">
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search plants"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { 
                bgcolor: 'white', 
                borderRadius: 28,
                '& fieldset': { 
                  borderRadius: 28,
                },
              }
            }}
          />
        </Box>

        {/* Quick Actions */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={3} sm={3}>
              <Box 
                component={Link} 
                to="/analyze"
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Avatar sx={{ bgcolor: '#E8F5E9', color: '#4CAF50', mb: 1 }}>
                  <DiagnoseIcon />
                </Avatar>
                <Typography variant="caption" align="center">Diagnose</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={3} sm={3}>
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
                <Avatar sx={{ bgcolor: '#E3F2FD', color: '#2196F3', mb: 1 }}>
                  <IdentifyIcon />
                </Avatar>
                <Typography variant="caption" align="center">Identify</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={3} sm={3}>
              <Box 
                component={Link} 
                to="/gemini-demo"
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
            
            <Grid item xs={3} sm={3}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Avatar sx={{ bgcolor: '#FFF8E1', color: '#FFC107', mb: 1 }}>
                  <PremiumIcon />
                </Avatar>
                <Typography variant="caption" align="center">Premium</Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={3} sm={3}>
              <Box 
                component={Link} 
                to="/plants"
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Avatar sx={{ bgcolor: '#E8F5E9', color: '#4CAF50', mb: 1 }}>
                  <GardenIcon />
                </Avatar>
                <Typography variant="caption" align="center">My Garden</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={3} sm={3}>
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
                  <BookIcon />
                </Avatar>
                <Typography variant="caption" align="center">Books</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={3} sm={3}>
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
                <Avatar sx={{ bgcolor: '#E8F5E9', color: '#4CAF50', mb: 1 }}>
                  <IdentifyIcon />
                </Avatar>
                <Typography variant="caption" align="center">360 Identify</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={3} sm={3}>
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

        {/* Hot Books Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
              Hot Books
            </Typography>
            <Box 
              component={Link} 
              to="/books"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                textDecoration: 'none',
                color: '#4CAF50'
              }}
            >
              <Typography variant="body2">More</Typography>
              <ChevronRightIcon fontSize="small" />
            </Box>
          </Box>
          
          <Grid container spacing={2}>
            {books.map((book) => (
              <Grid item xs={4} key={book.id}>
                <Card sx={{ height: '100%', boxShadow: 'none', borderRadius: 2 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height={120}
                      image={book.image}
                      alt={book.title}
                      sx={{ borderRadius: 2 }}
                    />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block', fontSize: '0.7rem' }}>
                      {book.title}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

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
                Your Plants
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
              {plants.slice(0, 4).map((plant) => (
                <Grid item xs={6} sm={3} key={plant.id}>
                  <Card sx={{ height: '100%', borderRadius: 2 }}>
                    <CardActionArea component={Link} to={`/plants/${plant.id}`}>
                      <CardMedia
                        component="img"
                        height={120}
                        image={plant.images.length > 0 ? plant.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={plant.name}
                      />
                      <CardContent sx={{ p: 1.5 }}>
                        <Typography variant="subtitle2" noWrap>
                          {plant.name}
                        </Typography>
                        {plant.species && (
                          <Typography variant="caption" color="text.secondary" display="block" noWrap>
                            {plant.species}
                          </Typography>
                        )}
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
          zIndex: 1000,
          borderRadius: 0,
          boxShadow: '0px -2px 10px rgba(0,0,0,0.05)'
        }}
        elevation={3}
      >
        <BottomNavigation showLabels>
          <BottomNavigationAction 
            label="Home" 
            icon={<HomeIcon />} 
            onClick={() => navigate('/')}
          />
          <BottomNavigationAction 
            label="My Plants" 
            icon={<LocalFloristIcon />} 
            onClick={() => navigate('/plants')}
          />
          <BottomNavigationAction 
            label="Add Plant" 
            icon={<AddCircleIcon />} 
            onClick={() => navigate('/add-plant')}
          />
          <BottomNavigationAction 
            label="Analyze" 
            icon={<CameraIcon />} 
            onClick={() => navigate('/camera')}
          />
          <BottomNavigationAction 
            label="Settings" 
            icon={<SettingsIcon />} 
            onClick={() => navigate('/settings')}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Dashboard; 