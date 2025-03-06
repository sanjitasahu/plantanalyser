import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tabs,
  Tab,
  Paper,
  Divider,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  AppBar,
  Toolbar,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  WaterDrop as WaterIcon,
  CameraAlt as CameraAltIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Opacity as OpacityIcon,
  WbSunny as SunIcon,
  Thermostat as TempIcon,
  Grass as SoilIcon,
  Info as InfoIcon,
  LocalFlorist as FlowerIcon,
  LocalFlorist as LeafIcon,
  BugReport as PestIcon,
  Healing as DiseaseIcon,
  Home as HomeIcon,
  LocalFlorist as LocalFloristIcon,
  AddCircle as AddCircleIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

import { usePlants } from '../context/PlantContext';
import { useAnalysis } from '../context/AnalysisContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`plant-tabpanel-${index}`}
      aria-labelledby={`plant-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const PlantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plants, updatePlant, deletePlant } = usePlants();
  const { analyzeImage, clearCurrentAnalysis } = useAnalysis();
  
  const [plant, setPlant] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlant, setEditedPlant] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [waterDialogOpen, setWaterDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (id && plants.length > 0) {
      const foundPlant = plants.find(p => p.id === id);
      if (foundPlant) {
        setPlant(foundPlant);
        setEditedPlant(foundPlant);
      } else {
        navigate('/plants');
      }
    }
  }, [id, plants, navigate]);

  if (!plant) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading plant details...</Typography>
      </Box>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedPlant({...plant});
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedPlant({...plant});
  };

  const handleSaveChanges = () => {
    if (plant && editedPlant) {
      updatePlant(plant.id, editedPlant);
      setPlant(editedPlant);
      setIsEditing(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (plant) {
      deletePlant(plant.id);
      setDeleteDialogOpen(false);
      navigate('/plants');
    }
  };

  const handleWaterPlant = () => {
    if (plant) {
      updatePlant(plant.id, { 
        lastWatered: new Date().toISOString() 
      });
      // Update local state to reflect the change
      setPlant({
        ...plant,
        lastWatered: new Date().toISOString()
      });
      setWaterDialogOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPlant({
      ...editedPlant,
      [e.target.name]: e.target.value
    });
  };

  const handleCaptureForAnalysis = () => {
    if (plant && plant.images && plant.images.length > 0) {
      // Navigate to analysis view with the plant image
      navigate('/analyze', { 
        state: { 
          imageUrl: plant.images[0],
          plantId: plant.id
        } 
      });
    } else {
      // If no images, navigate to camera to capture one
      navigate('/camera', { 
        state: { 
          returnTo: `/plants/${plant.id}`,
          forAnalysis: true
        } 
      });
    }
  };

  const handleNavigateToAnalyze = () => {
    clearCurrentAnalysis(); // Clear any previous analysis data
    navigate('/camera');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* Top App Bar */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: '#4CAF50' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/plants')}
            sx={{ color: 'white' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" sx={{ color: 'white' }}>
            <ShareIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Plant Header */}
      <Box 
        sx={{ 
          position: 'relative',
          height: 240,
          backgroundImage: `url(${plant.images.length > 0 ? plant.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            p: 2,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
            color: 'white'
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {plant.name}
          </Typography>
          {plant.species && (
            <Typography variant="subtitle1" sx={{ fontStyle: 'italic' }}>
              {plant.species}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 1, bgcolor: 'white' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            color: 'text.secondary'
          }}
        >
          <IconButton color="primary" onClick={() => setWaterDialogOpen(true)}>
            <WaterIcon />
          </IconButton>
          <Typography variant="caption">Water</Typography>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            color: 'text.secondary'
          }}
        >
          <IconButton color="primary" onClick={handleEditToggle}>
            <EditIcon />
          </IconButton>
          <Typography variant="caption">Edit</Typography>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            color: 'text.secondary'
          }}
        >
          <IconButton color="primary" onClick={handleCaptureForAnalysis}>
            <CameraAltIcon />
          </IconButton>
          <Typography variant="caption">Analyze</Typography>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            color: 'text.secondary'
          }}
        >
          <IconButton color="error" onClick={() => setDeleteDialogOpen(true)}>
            <DeleteIcon />
          </IconButton>
          <Typography variant="caption">Delete</Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ bgcolor: 'white' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          indicatorColor="primary"
          textColor="primary"
          sx={{ 
            '& .MuiTab-root': { 
              textTransform: 'none',
              fontWeight: 'medium',
            }
          }}
        >
          <Tab label="Info" />
          <Tab label="Care" />
          <Tab label="Health" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '50vh' }}>
        {/* Info Tab */}
        <TabPanel value={tabValue} index={0}>
          {isEditing ? (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Edit Plant Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Plant Name"
                      name="name"
                      value={editedPlant.name}
                      onChange={handleInputChange}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Species"
                      name="species"
                      value={editedPlant.species || ''}
                      onChange={handleInputChange}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={editedPlant.location || ''}
                      onChange={handleInputChange}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Notes"
                      name="notes"
                      value={editedPlant.notes || ''}
                      onChange={handleInputChange}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<CancelIcon />} 
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<SaveIcon />} 
                    onClick={handleSaveChanges}
                  >
                    Save
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <InfoIcon sx={{ mr: 1, color: '#4CAF50' }} /> Botanical Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Botanical name:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {plant.species || 'Unknown'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Common name:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {plant.name}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Genus:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {plant.genus || 'Unknown'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Location:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {plant.location || 'Not specified'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Added on:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {formatDate(plant.dateAdded)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              {plant.images.length > 0 && (
                <Card sx={{ mb: 2, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Images of {plant.name}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={1}>
                      {plant.images.map((image: string, index: number) => (
                        <Grid item xs={6} key={index}>
                          <Box
                            component="img"
                            src={image}
                            alt={`${plant.name} ${index + 1}`}
                            sx={{
                              width: '100%',
                              height: 120,
                              objectFit: 'cover',
                              borderRadius: 1
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              )}
              
              {plant.notes && (
                <Card sx={{ mb: 2, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Notes
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2">
                      {plant.notes}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabPanel>

        {/* Care Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <OpacityIcon sx={{ mr: 1, color: '#2196F3' }} /> Watering
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Last watered: <strong>{plant.lastWatered ? formatDate(plant.lastWatered) : 'Never'}</strong>
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<WaterIcon />} 
                  size="small"
                  onClick={() => setWaterDialogOpen(true)}
                  sx={{ mt: 1 }}
                >
                  Water Now
                </Button>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Recommended watering frequency: {plant.wateringFrequency || 'Not set'}
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SunIcon sx={{ mr: 1, color: '#FFC107' }} /> Light Requirements
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2">
                {plant.lightRequirements || 'No light requirements specified.'}
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TempIcon sx={{ mr: 1, color: '#FF5722' }} /> Temperature
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2">
                {plant.temperatureRequirements || 'No temperature requirements specified.'}
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SoilIcon sx={{ mr: 1, color: '#795548' }} /> Soil & Fertilizer
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2">
                {plant.soilRequirements || 'No soil requirements specified.'}
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Health Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LeafIcon sx={{ mr: 1, color: '#4CAF50' }} /> Current Health Status
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip 
                  label={plant.healthStatus || 'Unknown'} 
                  color={plant.healthStatus === 'Healthy' ? 'success' : plant.healthStatus === 'Needs Attention' ? 'warning' : 'error'} 
                  variant="outlined"
                />
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<CameraAltIcon />}
                onClick={handleCaptureForAnalysis}
                fullWidth
                sx={{ mt: 1 }}
              >
                Analyze Health Now
              </Button>
            </CardContent>
          </Card>
          
          {plant.healthHistory && plant.healthHistory.length > 0 && (
            <Card sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <DiseaseIcon sx={{ mr: 1, color: '#9C27B0' }} /> Health History
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List sx={{ p: 0 }}>
                  {plant.healthHistory.map((record: any, index: number) => (
                    <ListItem key={index} divider={index < plant.healthHistory.length - 1}>
                      <ListItemIcon>
                        {record.status === 'Healthy' ? (
                          <LeafIcon color="success" />
                        ) : record.status === 'Needs Attention' ? (
                          <PestIcon color="warning" />
                        ) : (
                          <DiseaseIcon color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={record.status}
                        secondary={`${formatDate(record.date)} - ${record.notes || 'No notes'}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
          
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PestIcon sx={{ mr: 1, color: '#FF9800' }} /> Common Issues
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" paragraph>
                {plant.commonIssues || 'No common issues information available for this plant.'}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
              >
                View Plant Care Guide
              </Button>
            </CardContent>
          </Card>
        </TabPanel>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Plant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {plant.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Water Confirmation Dialog */}
      <Dialog
        open={waterDialogOpen}
        onClose={() => setWaterDialogOpen(false)}
      >
        <DialogTitle>Water Plant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Mark {plant.name} as watered today?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWaterDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleWaterPlant} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

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
            icon={<CameraAltIcon />} 
            onClick={handleNavigateToAnalyze}
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

export default PlantDetail; 