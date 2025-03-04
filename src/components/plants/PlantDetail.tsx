import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  WaterDrop as WaterIcon,
  WbSunny as SunIcon,
  CalendarToday as CalendarIcon,
  ArrowBack as BackIcon,
  LocalFlorist as PlantIcon,
  CameraAlt as CameraIcon,
  Search as AnalyzeIcon,
} from '@mui/icons-material';
import { usePlants } from '../../context/PlantContext';
import { useAnalysis } from '../../context/AnalysisContext';
import { formatDate } from '../../utils/dateUtils';
import { Plant, AnalysisResult, PlantHealthIssue } from '../../types';

const PlantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plants, deletePlant, updatePlant, isLoading } = usePlants();
  const { analysisResults } = useAnalysis();
  
  const [plant, setPlant] = useState<Plant | null>(null);
  const [plantAnalyses, setPlantAnalyses] = useState<AnalysisResult[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [waterDialogOpen, setWaterDialogOpen] = useState(false);
  
  useEffect(() => {
    if (id && plants.length > 0) {
      const foundPlant = plants.find(p => p.id === id);
      if (foundPlant) {
        setPlant(foundPlant);
      } else {
        navigate('/plants');
      }
    }
  }, [id, plants, navigate]);
  
  useEffect(() => {
    if (id && analysisResults.length > 0) {
      const plantSpecificAnalyses = analysisResults.filter(
        analysis => analysis.plantId === id
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setPlantAnalyses(plantSpecificAnalyses);
    }
  }, [id, analysisResults]);
  
  const handleDeleteConfirm = () => {
    if (id) {
      deletePlant(id);
      setDeleteDialogOpen(false);
      navigate('/plants');
    }
  };
  
  const handleWaterPlant = () => {
    if (plant) {
      const updatedPlant = {
        ...plant,
        lastWatered: new Date().toISOString()
      };
      updatePlant(plant.id, updatedPlant);
      setWaterDialogOpen(false);
    }
  };
  
  const getDaysSinceWatered = () => {
    if (!plant?.lastWatered) return 'Never';
    
    const lastWatered = new Date(plant.lastWatered);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastWatered.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 0 ? 'Today' : `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };
  
  const getWateringStatus = () => {
    if (!plant?.lastWatered || !plant?.wateringFrequency) return 'unknown';
    
    const lastWatered = new Date(plant.lastWatered);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastWatered.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let daysUntilWatering: number;
    
    switch (plant.wateringFrequency) {
      case 'Daily':
        daysUntilWatering = 1;
        break;
      case 'Every 2-3 days':
        daysUntilWatering = 3;
        break;
      case 'Weekly':
        daysUntilWatering = 7;
        break;
      case 'Bi-weekly':
        daysUntilWatering = 14;
        break;
      case 'Monthly':
        daysUntilWatering = 30;
        break;
      default:
        return 'unknown';
    }
    
    if (diffDays >= daysUntilWatering) {
      return 'needs-water';
    } else if (diffDays >= daysUntilWatering * 0.75) {
      return 'soon';
    } else {
      return 'ok';
    }
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!plant) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Plant not found</Alert>
        <Button 
          component={Link} 
          to="/plants" 
          startIcon={<BackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Plants
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          component={Link} 
          to="/plants" 
          startIcon={<BackIcon />}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          {plant.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            color="primary" 
            component={Link} 
            to={`/plants/${plant.id}/edit`}
            aria-label="edit plant"
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={() => setDeleteDialogOpen(true)}
            aria-label="delete plant"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              height="300"
              image={plant.imageUrl || '/placeholder-plant.jpg'}
              alt={plant.name}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {plant.name}
              </Typography>
              
              {plant.species && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {plant.species}
                </Typography>
              )}
              
              {plant.healthStatus && (
                <Box sx={{ mt: 1, mb: 2 }}>
                  <Chip 
                    label={plant.healthStatus} 
                    color={
                      plant.healthStatus === 'Healthy' ? 'success' :
                      plant.healthStatus === 'Needs attention' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Added on:</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatDate(plant.dateAdded)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Last watered:</Typography>
                <Typography 
                  variant="body2" 
                  fontWeight="medium"
                  color={
                    getWateringStatus() === 'needs-water' ? 'error.main' :
                    getWateringStatus() === 'soon' ? 'warning.main' : 'inherit'
                  }
                >
                  {getDaysSinceWatered()}
                </Typography>
              </Box>
              
              <Button
                variant="outlined"
                color="primary"
                startIcon={<WaterIcon />}
                fullWidth
                onClick={() => setWaterDialogOpen(true)}
                sx={{ mt: 2 }}
              >
                Water Plant
              </Button>
            </CardContent>
          </Card>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Button
              variant="outlined"
              component={Link}
              to="/camera"
              startIcon={<CameraIcon />}
              sx={{ flex: 1 }}
            >
              Take Photo
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/analyze"
              startIcon={<AnalyzeIcon />}
              sx={{ flex: 1 }}
            >
              Analyze
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Plant Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Watering Frequency
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <WaterIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                    <Typography>{plant.wateringFrequency || 'Not specified'}</Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Sunlight Needs
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <SunIcon color="warning" sx={{ mr: 1, fontSize: 20 }} />
                    <Typography>{plant.sunlightNeeds || 'Not specified'}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Notes
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {plant.notes || 'No notes added yet.'}
            </Typography>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Analysis History
            </Typography>
            
            {plantAnalyses.length === 0 ? (
              <Alert severity="info">
                No analysis records found for this plant. Use the Analyze feature to check your plant's health.
              </Alert>
            ) : (
              <Box>
                {plantAnalyses.slice(0, 3).map((analysis, index) => (
                  <Card key={analysis.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle1">
                            {analysis.identification.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(analysis.date)}
                          </Typography>
                        </Box>
                        <Chip 
                          label={analysis.health.status} 
                          size="small"
                          color={
                            analysis.health.status === 'Healthy' ? 'success' :
                            analysis.health.status === 'Needs attention' ? 'warning' : 'error'
                          }
                        />
                      </Box>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {analysis.health.summary}
                      </Typography>
                      
                      {analysis.health.issues.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            Issues:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {analysis.health.issues.map((issue, i) => (
                              <Chip 
                                key={i} 
                                label={issue.name} 
                                size="small" 
                                variant="outlined"
                                color={issue.severity === 'high' ? 'error' : 'warning'}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {plantAnalyses.length > 3 && (
                  <Button 
                    component={Link} 
                    to={`/plants/${plant.id}/analysis`}
                    sx={{ mt: 1 }}
                  >
                    View All Analysis Records ({plantAnalyses.length})
                  </Button>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
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
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Water Plant Dialog */}
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
          <Button onClick={handleWaterPlant} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlantDetail; 