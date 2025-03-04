import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Alert,
  CircularProgress,
  Fab,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { usePlants } from '../../context/PlantContext';
import PlantCard from './PlantCard';

const PlantList: React.FC = () => {
  const { plants, deletePlant, isLoading } = usePlants();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHealth, setFilterHealth] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const itemsPerPage = 8;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterHealth(event.target.value);
    setPage(1); // Reset to first page on filter change
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleDeletePlant = (id: string) => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      deletePlant(id);
    }
  };

  // Filter and sort plants
  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (plant.species && plant.species.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesHealthFilter = filterHealth === 'all' || plant.healthStatus === filterHealth;
    
    return matchesSearch && matchesHealthFilter;
  });

  // Sort plants
  const sortedPlants = [...filteredPlants].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'dateAdded':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case 'lastWatered':
        return new Date(b.lastWatered).getTime() - new Date(a.lastWatered).getTime();
      default:
        return 0;
    }
  });

  // Paginate plants
  const indexOfLastPlant = page * itemsPerPage;
  const indexOfFirstPlant = indexOfLastPlant - itemsPerPage;
  const currentPlants = sortedPlants.slice(indexOfFirstPlant, indexOfLastPlant);
  const totalPages = Math.ceil(sortedPlants.length / itemsPerPage);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          My Plants
        </Typography>
        
        <Button
          component={Link}
          to="/add-plant"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Plant
        </Button>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search plants..."
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters ? "contained" : "outlined"}
            color="primary"
            size="medium"
          >
            Filters
          </Button>
        </Box>
        
        {showFilters && (
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Health Status</InputLabel>
              <Select
                value={filterHealth}
                onChange={handleFilterChange}
                label="Health Status"
              >
                <MenuItem value="all">All Plants</MenuItem>
                <MenuItem value="Healthy">Healthy</MenuItem>
                <MenuItem value="Needs attention">Needs Attention</MenuItem>
                <MenuItem value="Unhealthy">Unhealthy</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="dateAdded">Date Added</MenuItem>
                <MenuItem value="lastWatered">Last Watered</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : plants.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          You haven't added any plants yet. Click the "Add Plant" button to get started!
        </Alert>
      ) : filteredPlants.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No plants match your search criteria. Try adjusting your filters.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentPlants.map(plant => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={plant.id}>
                <PlantCard plant={plant} onDelete={handleDeletePlant} />
              </Grid>
            ))}
          </Grid>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      )}
      
      {/* Mobile Add Button */}
      <Box sx={{ display: { sm: 'none' }, position: 'fixed', bottom: 16, right: 16 }}>
        <Fab
          color="primary"
          component={Link}
          to="/add-plant"
          aria-label="add plant"
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default PlantList; 