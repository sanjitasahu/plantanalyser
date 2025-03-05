import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
  Collapse,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Fab,
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  PhotoLibrary as GalleryIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  LocalHospital as RemedyIcon,
  Home as HomeIcon,
  Close as CloseIcon,
  FileUpload as UploadIcon,
} from '@mui/icons-material';
import { useCamera } from '../../context/CameraContext';
import { useAnalysis } from '../../context/AnalysisContext';
import Camera from '../camera/Camera';

// Custom expand button component
const ExpandButton = ({ expanded, onClick }: { expanded: boolean; onClick: () => void }) => (
  <IconButton
    onClick={onClick}
    aria-expanded={expanded}
    aria-label="show more"
    sx={{
      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
      marginLeft: 'auto',
      transition: 'transform 0.15s ease-in-out',
    }}
  >
    <ExpandMoreIcon />
  </IconButton>
);

const PlantDiagnosis: React.FC = () => {
  // State for UI controls
  const [showCamera, setShowCamera] = useState(true); // Camera is shown by default
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandHomeRemedy, setExpandHomeRemedy] = useState(false);
  const [expandOverallRemedy, setExpandOverallRemedy] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  
  // Context hooks
  const { capturedImages, captureImage } = useCamera();
  const { 
    currentAnalysis, 
    isAnalyzing, 
    error, 
    analyzeImage,
    clearCurrentAnalysis,
  } = useAnalysis();

  // Open camera by default when component mounts
  useEffect(() => {
    clearCurrentAnalysis();
    setShowCamera(true);
  }, [clearCurrentAnalysis]);

  // Watch for new captured images and automatically analyze them
  useEffect(() => {
    if (capturedImages.length > 0) {
      const latestImage = capturedImages[capturedImages.length - 1];
      
      // Only process if this is a new image (not already selected)
      if (selectedImage !== latestImage.dataUrl) {
        setSelectedImage(latestImage.dataUrl);
        setShowCamera(false);
        
        // Automatically start analysis
        analyzeImage(latestImage.dataUrl);
      }
    }
  }, [capturedImages, selectedImage, analyzeImage]);

  // Handle the "Take Photo" button click
  const handleTakePhoto = () => {
    clearCurrentAnalysis();
    setShowCamera(true);
  };

  // Handle file upload from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Image file is too large. Please use an image smaller than 10MB.');
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setSelectedImage(imageData);
        setShowCamera(false);
        clearCurrentAnalysis();
        
        // Automatically start analysis
        analyzeImage(imageData);
      };
      reader.onerror = () => {
        alert('Error reading the image file. Please try another image.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Get health status color
  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return 'success';
      case 'needs attention':
        return 'warning';
      case 'unhealthy':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get health status icon
  const getHealthStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return <CheckIcon color="success" />;
      case 'needs attention':
        return <WarningIcon color="warning" />;
      case 'unhealthy':
        return <WarningIcon color="error" />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2, position: 'relative' }}>
      <Typography variant="h5" gutterBottom>
        Plant Diagnosis
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {isAnalyzing && (
        <Box sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.8)',
          zIndex: 1000
        }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Analyzing your plant...
          </Typography>
        </Box>
      )}
      
      {showCamera ? (
        <Box sx={{ position: 'relative' }}>
          <Camera />
          
          {/* Upload button overlay */}
          <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
              sx={{ 
                bgcolor: 'background.paper', 
                color: 'primary.main',
                '&:hover': { bgcolor: 'background.default' }
              }}
            >
              Upload
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
          </Box>
        </Box>
      ) : currentAnalysis ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <img 
                  src={selectedImage || ''} 
                  alt="Selected plant" 
                  style={{ 
                    width: '100%', 
                    borderRadius: 8,
                    objectFit: 'cover',
                  }} 
                />
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CameraIcon />}
                    onClick={handleTakePhoto}
                    fullWidth
                  >
                    Take Another Photo
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={currentAnalysis.health.status}
                  color={getHealthStatusColor(currentAnalysis.health.status) as any}
                  icon={getHealthStatusIcon(currentAnalysis.health.status)}
                  sx={{ mb: 1 }}
                />
                <Typography variant="h5" gutterBottom>
                  {currentAnalysis.identification.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {currentAnalysis.identification.scientificName}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Diagnostic Information
              </Typography>
              <Typography variant="body1" paragraph>
                {currentAnalysis.health.summary}
              </Typography>
              
              {currentAnalysis.health.issues.length > 0 && (
                <Box sx={{ mt: 2, mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Identified Issues:
                  </Typography>
                  {currentAnalysis.health.issues.map((issue, index) => (
                    <Card key={index} sx={{ mb: 2, bgcolor: 'background.default' }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {issue.name} 
                          <Chip 
                            size="small" 
                            label={issue.severity} 
                            color={
                              issue.severity === 'high' ? 'error' : 
                              issue.severity === 'medium' ? 'warning' : 'success'
                            }
                            sx={{ ml: 1 }}
                          />
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {issue.description}
                        </Typography>
                        {issue.solution && (
                          <Typography variant="body2">
                            <strong>Solution:</strong> {issue.solution}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              {/* Home Remedy Section */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HomeIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Home Remedy
                    </Typography>
                    <ExpandButton 
                      expanded={expandHomeRemedy}
                      onClick={() => setExpandHomeRemedy(!expandHomeRemedy)}
                    />
                  </Box>
                  
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {currentAnalysis.care.additionalTips ? 
                      currentAnalysis.care.additionalTips.substring(0, 100) + '...' : 
                      'No home remedies available for this plant.'}
                  </Typography>
                  
                  <Collapse in={expandHomeRemedy} timeout="auto" unmountOnExit>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {currentAnalysis.care.additionalTips || 'No home remedies available for this plant.'}
                    </Typography>
                  </Collapse>
                </CardContent>
              </Card>
              
              {/* Overall Remedy Section */}
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RemedyIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Overall Care
                    </Typography>
                    <ExpandButton 
                      expanded={expandOverallRemedy}
                      onClick={() => setExpandOverallRemedy(!expandOverallRemedy)}
                    />
                  </Box>
                  
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {currentAnalysis.care.summary ? 
                      currentAnalysis.care.summary.substring(0, 100) + '...' : 
                      'No care information available for this plant.'}
                  </Typography>
                  
                  <Collapse in={expandOverallRemedy} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" paragraph>
                        <strong>Watering:</strong> {currentAnalysis.care.watering}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Light:</strong> {currentAnalysis.care.light}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Soil:</strong> {currentAnalysis.care.soil}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Temperature & Humidity:</strong> {currentAnalysis.care.temperature} {currentAnalysis.care.humidity && `Humidity: ${currentAnalysis.care.humidity}`}
                      </Typography>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '50vh' 
        }}>
          <Typography variant="h6" color="text.secondary" align="center">
            Loading camera...
          </Typography>
          <CircularProgress sx={{ mt: 2 }} />
        </Box>
      )}
      
      {/* Floating action button for upload when camera is not shown */}
      {!showCamera && !currentAnalysis && (
        <Fab
          color="primary"
          aria-label="upload"
          component="label"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <UploadIcon />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileUpload}
          />
        </Fab>
      )}
    </Box>
  );
};

export default PlantDiagnosis; 