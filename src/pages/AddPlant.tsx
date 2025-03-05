import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Divider,
  AppBar,
  Toolbar,
  Card,
  CardMedia,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PhotoCamera as CameraIcon,
  AddPhotoAlternate as GalleryIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
} from '@mui/icons-material';

import { usePlants } from '../context/PlantContext';

const AddPlant: React.FC = () => {
  const navigate = useNavigate();
  const { addPlant } = usePlants();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [plantName, setPlantName] = useState('');
  const [species, setSpecies] = useState('');
  const [location, setLocation] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState('');
  const [lightRequirements, setLightRequirements] = useState('');
  const [notes, setNotes] = useState('');
  const [healthStatus, setHealthStatus] = useState<'Healthy' | 'Needs attention' | 'Unhealthy'>('Healthy');
  const [images, setImages] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const newImages: string[] = [...images];
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string);
          setImages([...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCameraCapture = () => {
    navigate('/camera', { state: { returnTo: '/add-plant' } });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!plantName.trim()) {
      newErrors.plantName = 'Plant name is required';
    }
    
    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      await addPlant({
        name: plantName,
        species: species,
        images: images,
        lastWatered: new Date().toISOString(),
        wateringFrequency: wateringFrequency,
        sunlightNeeds: lightRequirements,
        notes: notes,
        healthStatus: healthStatus
      });
      
      navigate('/plants');
    } catch (error) {
      console.error('Error adding plant:', error);
      setErrors({ submit: 'Failed to add plant. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
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
            Add New Plant
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Plant Images */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Plant Images
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            {images.map((image, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <Card sx={{ position: 'relative', borderRadius: 2 }}>
                  <CardMedia
                    component="img"
                    height={140}
                    image={image}
                    alt={`Plant image ${index + 1}`}
                    sx={{ borderRadius: 2 }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))}
            
            {/* Add Image Buttons */}
            <Grid item xs={6} sm={4}>
              <Paper
                sx={{
                  height: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 2,
                  border: '1px dashed #ccc',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <GalleryIcon color="primary" sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Upload from Gallery
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={6} sm={4}>
              <Paper
                sx={{
                  height: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 2,
                  border: '1px dashed #ccc',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
                onClick={handleCameraCapture}
              >
                <CameraIcon color="primary" sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Take Photo
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {errors.images && (
            <FormHelperText error sx={{ mt: 1 }}>
              {errors.images}
            </FormHelperText>
          )}
          
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </Paper>

        {/* Basic Information */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Plant Name"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                error={!!errors.plantName}
                helperText={errors.plantName}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Species (Scientific Name)"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="e.g., Monstera deliciosa"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="location-label">Location</InputLabel>
                <Select
                  labelId="location-label"
                  value={location}
                  label="Location"
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <MenuItem value="Indoor">Indoor</MenuItem>
                  <MenuItem value="Outdoor">Outdoor</MenuItem>
                  <MenuItem value="Balcony">Balcony</MenuItem>
                  <MenuItem value="Garden">Garden</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="health-status-label">Health Status</InputLabel>
                <Select
                  labelId="health-status-label"
                  value={healthStatus}
                  label="Health Status"
                  onChange={(e) => setHealthStatus(e.target.value as 'Healthy' | 'Needs attention' | 'Unhealthy')}
                >
                  <MenuItem value="Healthy">Healthy</MenuItem>
                  <MenuItem value="Needs attention">Needs Attention</MenuItem>
                  <MenuItem value="Unhealthy">Unhealthy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Care Information */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Care Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="watering-frequency-label">Watering Frequency</InputLabel>
                <Select
                  labelId="watering-frequency-label"
                  value={wateringFrequency}
                  label="Watering Frequency"
                  onChange={(e) => setWateringFrequency(e.target.value)}
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Every 2-3 days">Every 2-3 days</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Every 2 weeks">Every 2 weeks</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="light-requirements-label">Light Requirements</InputLabel>
                <Select
                  labelId="light-requirements-label"
                  value={lightRequirements}
                  label="Light Requirements"
                  onChange={(e) => setLightRequirements(e.target.value)}
                >
                  <MenuItem value="Full Sun">Full Sun</MenuItem>
                  <MenuItem value="Partial Sun">Partial Sun</MenuItem>
                  <MenuItem value="Bright Indirect">Bright Indirect</MenuItem>
                  <MenuItem value="Medium Light">Medium Light</MenuItem>
                  <MenuItem value="Low Light">Low Light</MenuItem>
                  <MenuItem value="Shade">Shade</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={4}
                placeholder="Add any additional notes about your plant..."
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Submit Button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={isSubmitting}
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: 28
            }}
          >
            {isSubmitting ? 'Adding Plant...' : 'Add to My Garden'}
          </Button>
        </Box>
        
        {errors.submit && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {errors.submit}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default AddPlant; 