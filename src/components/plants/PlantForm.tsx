import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { Plant } from '../../types';

interface PlantFormProps {
  initialValues?: Partial<Plant>;
  onSubmit: (plantData: Omit<Plant, 'id'>) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const PlantForm: React.FC<PlantFormProps> = ({
  initialValues = {},
  onSubmit,
  isLoading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<Omit<Plant, 'id'>>({
    name: '',
    species: '',
    imageUrl: '',
    images: [],
    dateAdded: new Date().toISOString(),
    lastWatered: new Date().toISOString(),
    wateringFrequency: '',
    sunlightNeeds: '',
    notes: '',
    healthStatus: 'Healthy',
    ...initialValues,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setFormData(prevData => ({
        ...prevData,
        ...initialValues,
      }));
    }
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | 
    SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
      
      // Clear error when field is updated
      if (formErrors[name]) {
        setFormErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Plant name is required';
    }
    
    if (!formData.wateringFrequency.trim()) {
      errors.wateringFrequency = 'Watering frequency is required';
    }
    
    if (!formData.sunlightNeeds.trim()) {
      errors.sunlightNeeds = 'Sunlight needs is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {initialValues?.id ? 'Edit Plant' : 'Add New Plant'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Plant Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Species"
              name="species"
              value={formData.species}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/plant-image.jpg"
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!formErrors.wateringFrequency}>
              <InputLabel>Watering Frequency</InputLabel>
              <Select
                name="wateringFrequency"
                value={formData.wateringFrequency}
                label="Watering Frequency"
                onChange={handleChange}
                disabled={isLoading}
              >
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Every 2-3 days">Every 2-3 days</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Bi-weekly">Bi-weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
              </Select>
              {formErrors.wateringFrequency && (
                <FormHelperText>{formErrors.wateringFrequency}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!formErrors.sunlightNeeds}>
              <InputLabel>Sunlight Needs</InputLabel>
              <Select
                name="sunlightNeeds"
                value={formData.sunlightNeeds}
                label="Sunlight Needs"
                onChange={handleChange}
                disabled={isLoading}
              >
                <MenuItem value="Full sun">Full sun</MenuItem>
                <MenuItem value="Partial sun">Partial sun</MenuItem>
                <MenuItem value="Indirect light">Indirect light</MenuItem>
                <MenuItem value="Shade">Shade</MenuItem>
              </Select>
              {formErrors.sunlightNeeds && (
                <FormHelperText>{formErrors.sunlightNeeds}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Health Status</InputLabel>
              <Select
                name="healthStatus"
                value={formData.healthStatus}
                label="Health Status"
                onChange={handleChange}
                disabled={isLoading}
              >
                <MenuItem value="Healthy">Healthy</MenuItem>
                <MenuItem value="Needs attention">Needs attention</MenuItem>
                <MenuItem value="Unhealthy">Unhealthy</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Watered"
              name="lastWatered"
              type="date"
              value={formData.lastWatered ? formData.lastWatered.split('T')[0] : ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={4}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ minWidth: 120 }}
            >
              {isLoading ? <CircularProgress size={24} /> : initialValues?.id ? 'Update Plant' : 'Add Plant'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default PlantForm; 