import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Chip,
  Divider,
  AppBar,
  Toolbar,
  Fab,
  Badge,
  Paper,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Opacity as WaterIcon,
  CheckCircle as HealthyIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  LocalFlorist as LocalFloristIcon,
  AddCircle as AddCircleIcon,
  CameraAlt as CameraAltIcon
} from '@mui/icons-material';

import { usePlants } from '../context/PlantContext';

const PlantList: React.FC = () => {
  const navigate = useNavigate();
  const { plants, deletePlant, updatePlant } = usePlants();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlants, setFilteredPlants] = useState(plants);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [waterDialogOpen, setWaterDialogOpen] = useState(false);
  
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('dateAdded-desc');
  const [healthFilter, setHealthFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    let filtered = [...plants];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(plant => 
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plant.species && plant.species.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply health status filter
    if (healthFilter) {
      filtered = filtered.filter(plant => plant.healthStatus === healthFilter);
    }
    
    // Apply location filter (if location property exists)
    if (locationFilter) {
      // Skip location filtering since location property doesn't exist in Plant type
    }
    
    // Sort plants by date added (newest first)
    filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    
    setFilteredPlants(filtered);
  }, [plants, searchTerm, healthFilter, locationFilter]);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleSort = (sortOption: string) => {
    setSortOption(sortOption);
    handleSortClose();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePlantClick = (id: string) => {
    navigate(`/plants/${id}`);
  };

  const handleAddPlant = () => {
    navigate('/add-plant');
  };

  const openWaterDialog = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedPlantId(id);
    setWaterDialogOpen(true);
  };

  const handleWaterPlant = () => {
    if (selectedPlantId) {
      const plant = plants.find(p => p.id === selectedPlantId);
      if (plant) {
        updatePlant(selectedPlantId, { 
          lastWatered: new Date().toISOString() 
        });
        setSnackbarMessage(`${plant.name} has been watered!`);
        setSnackbarOpen(true);
      }
      setWaterDialogOpen(false);
      setSelectedPlantId(null);
    }
  };

  const openDeleteDialog = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedPlantId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeletePlant = () => {
    if (selectedPlantId) {
      deletePlant(selectedPlantId);
      setDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderHealthIcon = (status: 'Healthy' | 'Needs attention' | 'Unhealthy') => {
    switch (status) {
      case 'Healthy':
        return <HealthyIcon color="success" fontSize="small" />;
      case 'Needs attention':
        return <WarningIcon color="warning" fontSize="small" />;
      case 'Unhealthy':
        return <ErrorIcon color="error" fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* Top App Bar */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: '#4CAF50' }}>
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1, color: 'white', fontWeight: 'bold' }}>
            My Garden
          </Typography>
          <IconButton color="inherit" sx={{ color: 'white' }}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Search and Filter Bar */}
      <Box sx={{ p: 2, bgcolor: 'white' }}>
        <TextField
          fullWidth
          placeholder="Search plants"
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Box sx={{ display: 'flex' }}>
                  <Badge 
                    badgeContent={activeFilters.length} 
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    <IconButton 
                      edge="end" 
                      onClick={handleFilterClick}
                      size="small"
                    >
                      <FilterIcon />
                    </IconButton>
                  </Badge>
                  <IconButton 
                    edge="end" 
                    onClick={handleSortClick}
                    size="small"
                  >
                    <SortIcon />
                  </IconButton>
                </Box>
              </InputAdornment>
            ),
            sx: { 
              borderRadius: 2,
              '& fieldset': { 
                borderRadius: 2,
              },
            }
          }}
          size="small"
        />
      </Box>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ px: 2, py: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {activeFilters.map(filter => (
            <Chip 
              key={filter}
              label={filter === 'healthy' ? 'Healthy' : 
                    filter === 'needsAttention' ? 'Needs Attention' : 
                    filter === 'unhealthy' ? 'Unhealthy' :
                    filter === 'indoor' ? 'Indoor' : 'Outdoor'}
              onDelete={() => toggleFilter(filter)}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
          <Chip 
            label="Clear All" 
            onClick={() => setActiveFilters([])}
            size="small"
            variant="outlined"
          />
        </Box>
      )}

      {/* Plant List */}
      <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        {filteredPlants.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {plants.length === 0 
                ? "You haven't added any plants yet." 
                : "No plants match your search criteria."}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={handleAddPlant}
              sx={{ mt: 2 }}
            >
              Add Your First Plant
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {filteredPlants.map((plant) => (
              <Grid item xs={6} sm={4} md={3} key={plant.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    borderRadius: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardActionArea onClick={() => handlePlantClick(plant.id)}>
                    <CardMedia
                      component="img"
                      height={140}
                      image={plant.images.length > 0 ? plant.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={plant.name}
                    />
                    <CardContent sx={{ p: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>
                          {plant.name}
                        </Typography>
                        {renderHealthIcon(plant.healthStatus)}
                      </Box>
                      
                      {plant.species && (
                        <Typography variant="caption" color="text.secondary" display="block" noWrap>
                          {plant.species}
                        </Typography>
                      )}
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {plant.lastWatered ? `Watered: ${formatDate(plant.lastWatered)}` : 'Not watered yet'}
                        </Typography>
                        
                        <Box>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={(e) => openWaterDialog(plant.id, e)}
                            sx={{ p: 0.5 }}
                          >
                            <WaterIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={(e) => openDeleteDialog(plant.id, e)}
                            sx={{ p: 0.5 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', width: '100%' }}>
            Health Status
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => toggleFilter('healthy')}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <HealthyIcon color="success" fontSize="small" sx={{ mr: 1 }} />
            <Typography>Healthy</Typography>
            {activeFilters.includes('healthy') && (
              <Box sx={{ ml: 'auto' }}>✓</Box>
            )}
          </Box>
        </MenuItem>
        <MenuItem onClick={() => toggleFilter('needsAttention')}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <WarningIcon color="warning" fontSize="small" sx={{ mr: 1 }} />
            <Typography>Needs Attention</Typography>
            {activeFilters.includes('needsAttention') && (
              <Box sx={{ ml: 'auto' }}>✓</Box>
            )}
          </Box>
        </MenuItem>
        <MenuItem onClick={() => toggleFilter('unhealthy')}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <ErrorIcon color="error" fontSize="small" sx={{ mr: 1 }} />
            <Typography>Unhealthy</Typography>
            {activeFilters.includes('unhealthy') && (
              <Box sx={{ ml: 'auto' }}>✓</Box>
            )}
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', width: '100%' }}>
            Location
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => toggleFilter('indoor')}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography>Indoor</Typography>
            {activeFilters.includes('indoor') && (
              <Box sx={{ ml: 'auto' }}>✓</Box>
            )}
          </Box>
        </MenuItem>
        <MenuItem onClick={() => toggleFilter('outdoor')}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography>Outdoor</Typography>
            {activeFilters.includes('outdoor') && (
              <Box sx={{ ml: 'auto' }}>✓</Box>
            )}
          </Box>
        </MenuItem>
      </Menu>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
      >
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', width: '100%' }}>
            Sort By
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => handleSort('name-asc')}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography>Name (A-Z)</Typography>
            {sortOption === 'name-asc' && (
              <Box sx={{ ml: 'auto' }}>✓</Box>
            )}
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleSort('name-desc')}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography>Name (Z-A)</Typography>
            {sortOption === 'name-desc' && (
              <Box sx={{ ml: 'auto' }}>✓</Box>
            )}
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleSort('dateAdded-desc')}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography>Newest First</Typography>
            {sortOption === 'dateAdded-desc' && (
              <Box sx={{ ml: 'auto' }}>✓</Box>
            )}
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleSort('dateAdded-asc')}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography>Oldest First</Typography>
            {sortOption === 'dateAdded-asc' && (
              <Box sx={{ ml: 'auto' }}>✓</Box>
            )}
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleSort('lastWatered-desc')}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography>Recently Watered</Typography>
            {sortOption === 'lastWatered-desc' && (
              <Box sx={{ ml: 'auto' }}>✓</Box>
            )}
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleSort('lastWatered-asc')}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography>Needs Watering</Typography>
            {sortOption === 'lastWatered-asc' && (
              <Box sx={{ ml: 'auto' }}>✓</Box>
            )}
          </Box>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Plant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this plant? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeletePlant} color="error">Delete</Button>
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
            Mark this plant as watered today?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWaterDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleWaterPlant} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Add Plant FAB */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={handleAddPlant}
      >
        <AddIcon />
      </Fab>

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

export default PlantList; 