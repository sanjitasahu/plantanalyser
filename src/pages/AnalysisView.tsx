import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Chip,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocalFlorist as PlantIcon,
  Spa as HealthyIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  WaterDrop as WaterIcon,
  WbSunny as SunIcon,
  Opacity as HumidityIcon,
  Thermostat as TemperatureIcon,
  BugReport as PestIcon,
  Healing as DiseaseIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  CameraAlt as CameraIcon
} from '@mui/icons-material';

import { useAnalysis } from '../context/AnalysisContext';
import { usePlants } from '../context/PlantContext';

const AnalysisView: React.FC = () => {
  const navigate = useNavigate();
  const { currentImage, currentAnalysis, isAnalyzing, analyzeCurrentImage, clearCurrentAnalysis } = useAnalysis();
  const { addPlant, updatePlant } = usePlants();
  
  const [activeStep, setActiveStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentImage) {
      navigate('/camera');
      return;
    }
    
    if (!currentAnalysis && !isAnalyzing) {
      analyzeCurrentImage();
    }
    
    if (currentAnalysis) {
      setActiveStep(2);
    } else if (isAnalyzing) {
      setActiveStep(1);
    } else {
      setActiveStep(0);
    }
  }, [currentImage, currentAnalysis, isAnalyzing, navigate, analyzeCurrentImage]);

  const handleSaveToCollection = async () => {
    if (!currentAnalysis) return;
    
    try {
      setIsSaving(true);
      setSaveError(null);
      
      // If this is for an existing plant (from context)
      if (currentAnalysis.plantId) {
        await updatePlant(currentAnalysis.plantId, {
          healthStatus: currentAnalysis.health.status,
        });
      } else {
        // Create a new plant
        await addPlant({
          name: currentAnalysis.identification.name,
          species: currentAnalysis.identification.scientificName,
          images: [currentImage as string],
          lastWatered: new Date().toISOString(),
          healthStatus: currentAnalysis.health.status,
          notes: currentAnalysis.care.summary,
          wateringFrequency: currentAnalysis.care.watering,
          sunlightNeeds: currentAnalysis.care.light,
        });
      }
      
      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/plants');
      }, 1500);
    } catch (error) {
      console.error('Error saving plant:', error);
      setSaveError('Failed to save plant. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderHealthStatus = (status: 'Healthy' | 'Needs attention' | 'Unhealthy') => {
    switch (status) {
      case 'Healthy':
        return (
          <Chip 
            icon={<HealthyIcon />} 
            label="Healthy" 
            color="success" 
            variant="filled" 
            sx={{ fontWeight: 'bold' }}
          />
        );
      case 'Needs attention':
        return (
          <Chip 
            icon={<WarningIcon />} 
            label="Needs Attention" 
            color="warning" 
            variant="filled" 
            sx={{ fontWeight: 'bold' }}
          />
        );
      case 'Unhealthy':
        return (
          <Chip 
            icon={<ErrorIcon />} 
            label="Unhealthy" 
            color="error" 
            variant="filled" 
            sx={{ fontWeight: 'bold' }}
          />
        );
      default:
        return null;
    }
  };

  // Handle back button click
  const handleBackClick = () => {
    clearCurrentAnalysis(); // Clear analysis data when navigating away
    navigate(-1);
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* Top App Bar */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: '#4CAF50' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBackClick}
            sx={{ color: 'white' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white', fontWeight: 'bold' }}>
            Plant Analysis
          </Typography>
          {currentAnalysis && (
            <IconButton color="inherit" sx={{ color: 'white' }}>
              <ShareIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Analysis Progress */}
      <Box sx={{ p: 2, bgcolor: 'white' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          <Step>
            <StepLabel>Capture Image</StepLabel>
          </Step>
          <Step>
            <StepLabel>Analyzing</StepLabel>
          </Step>
          <Step>
            <StepLabel>Results</StepLabel>
          </Step>
        </Stepper>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Loading State */}
        {isAnalyzing && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} color="primary" sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              Analyzing Your Plant
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
              Our AI is identifying your plant, assessing its health, and preparing care recommendations...
            </Typography>
          </Box>
        )}

        {/* Error State - No Image */}
        {!currentImage && !isAnalyzing && (
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="error" gutterBottom>
              No Image Available
            </Typography>
            <Typography variant="body1" paragraph>
              Please capture an image of your plant to analyze.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<CameraIcon />}
              onClick={() => navigate('/camera')}
              sx={{ mt: 2 }}
            >
              Take Photo
            </Button>
          </Paper>
        )}

        {/* Analysis Results */}
        {currentAnalysis && currentImage && (
          <Grid container spacing={2}>
            {/* Plant Image */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                <Box 
                  component="img" 
                  src={currentImage} 
                  alt="Analyzed plant" 
                  sx={{ 
                    width: '100%',
                    height: 240,
                    objectFit: 'cover'
                  }} 
                />
              </Card>
            </Grid>

            {/* Plant Identification */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 2, mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                        {currentAnalysis.identification.name}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontStyle: 'italic', mb: 1 }}>
                        {currentAnalysis.identification.scientificName}
                      </Typography>
                    </Box>
                    {renderHealthStatus(currentAnalysis.health.status)}
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="body2" paragraph>
                    {currentAnalysis.identification.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<SaveIcon />}
                      onClick={handleSaveToCollection}
                      disabled={isSaving || saveSuccess}
                    >
                      {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save to My Garden'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Health Assessment */}
            <Grid item xs={12}>
              <Accordion 
                defaultExpanded 
                sx={{ 
                  borderRadius: 2, 
                  mb: 2,
                  '&:before': { display: 'none' },
                  boxShadow: 1
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    bgcolor: currentAnalysis.health.status === 'Healthy' ? '#E8F5E9' : 
                            currentAnalysis.health.status === 'Needs attention' ? '#FFF8E1' : '#FFEBEE',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    Health Assessment
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" paragraph>
                    {currentAnalysis.health.summary}
                  </Typography>
                  
                  {currentAnalysis.health.issues && currentAnalysis.health.issues.length > 0 && (
                    <>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                        Identified Issues:
                      </Typography>
                      <List disablePadding>
                        {currentAnalysis.health.issues.map((issue, index) => (
                          <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {issue.severity === 'high' ? (
                                <ErrorIcon color="error" />
                              ) : (
                                <WarningIcon color="warning" />
                              )}
                            </ListItemIcon>
                            <ListItemText 
                              primary={issue.name} 
                              secondary={issue.description} 
                              primaryTypographyProps={{ fontWeight: 'medium' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            </Grid>

            {/* Care Recommendations */}
            <Grid item xs={12}>
              <Accordion 
                defaultExpanded 
                sx={{ 
                  borderRadius: 2, 
                  mb: 2,
                  '&:before': { display: 'none' },
                  boxShadow: 1
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    bgcolor: '#E3F2FD',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    Care Recommendations
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" paragraph>
                    {currentAnalysis.care.summary}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Card sx={{ height: '100%', boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <WaterIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                              Watering
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {currentAnalysis.care.watering}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Card sx={{ height: '100%', boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <SunIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                              Light
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {currentAnalysis.care.light}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Card sx={{ height: '100%', boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <HumidityIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                              Humidity
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {currentAnalysis.care.humidity || 'Average humidity levels recommended'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Card sx={{ height: '100%', boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TemperatureIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                              Temperature
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {currentAnalysis.care.temperature || '65-80°F (18-27°C)'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default AnalysisView; 