import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { 
  identifyPlant, 
  assessPlantHealth, 
  getPlantCareRecommendations 
} from '../../services/GeminiService';
import { PlantIdentification, PlantHealth, PlantCare } from '../../types';

const GeminiApiDemo: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [identification, setIdentification] = useState<PlantIdentification | null>(null);
  const [health, setHealth] = useState<PlantHealth | null>(null);
  const [care, setCare] = useState<PlantCare | null>(null);
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleIdentifyPlant = async () => {
    if (!imageUrl) {
      setError('Please provide an image URL or upload an image');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await identifyPlant(imageUrl);
      setIdentification(result);
      
      // Clear other results
      setHealth(null);
      setCare(null);
    } catch (err) {
      setError('Error identifying plant: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAssessHealth = async () => {
    if (!imageUrl) {
      setError('Please provide an image URL or upload an image');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await assessPlantHealth(imageUrl);
      setHealth(result);
    } catch (err) {
      setError('Error assessing plant health: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGetCareRecommendations = async () => {
    if (!identification) {
      setError('Please identify the plant first');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getPlantCareRecommendations(
        identification.name,
        identification.scientificName
      );
      setCare(result);
    } catch (err) {
      setError('Error getting care recommendations: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gemini API Demo
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Test the Gemini API Integration
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Image URL (or upload an image)"
              value={imageUrl}
              onChange={handleImageUrlChange}
              variant="outlined"
              placeholder="Paste a base64 image URL or upload an image"
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              component="label"
              fullWidth
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
          </Grid>
        </Grid>
        
        {imageUrl && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <img 
              src={imageUrl} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '300px',
                borderRadius: '8px',
              }} 
            />
          </Box>
        )}
        
        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleIdentifyPlant}
            disabled={isLoading || !imageUrl}
          >
            Identify Plant
          </Button>
          
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAssessHealth}
            disabled={isLoading || !imageUrl}
          >
            Assess Health
          </Button>
          
          <Button
            variant="contained"
            color="success"
            onClick={handleGetCareRecommendations}
            disabled={isLoading || !identification}
          >
            Get Care Recommendations
          </Button>
        </Box>
        
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Paper>
      
      <Grid container spacing={3}>
        {identification && (
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Plant Identification
                </Typography>
                
                <Typography variant="h5" gutterBottom>
                  {identification.name}
                </Typography>
                
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {identification.scientificName}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2" paragraph>
                  {identification.description}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Confidence: {identification.confidence}%
                </Typography>
                
                {identification.tags && identification.tags.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tags: {identification.tags.join(', ')}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
        
        {health && (
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Health Assessment
                </Typography>
                
                <Typography variant="h5" gutterBottom>
                  {health.status}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2" paragraph>
                  {health.summary}
                </Typography>
                
                {health.issues.length > 0 ? (
                  <>
                    <Typography variant="subtitle2" gutterBottom>
                      Issues Detected:
                    </Typography>
                    
                    {health.issues.map((issue, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {issue.name} (Severity: {issue.severity})
                        </Typography>
                        <Typography variant="body2">
                          {issue.description}
                        </Typography>
                        {issue.solution && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Solution: {issue.solution}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </>
                ) : (
                  <Alert severity="success">
                    No issues detected. Your plant appears to be healthy!
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
        
        {care && (
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="success.main" gutterBottom>
                  Care Recommendations
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Watering:
                </Typography>
                <Typography variant="body2" paragraph>
                  {care.watering}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Light:
                </Typography>
                <Typography variant="body2" paragraph>
                  {care.light}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Soil & Fertilizer:
                </Typography>
                <Typography variant="body2" paragraph>
                  {care.soil}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Temperature & Humidity:
                </Typography>
                <Typography variant="body2" paragraph>
                  {care.temperature}
                </Typography>
                
                {care.additionalTips && (
                  <>
                    <Typography variant="subtitle2" gutterBottom>
                      Additional Tips:
                    </Typography>
                    <Typography variant="body2">
                      {care.additionalTips}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default GeminiApiDemo; 