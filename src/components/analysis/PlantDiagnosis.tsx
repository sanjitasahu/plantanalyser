import React, { useState } from 'react';
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
  const [showCamera, setShowCamera] = useState(false);
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

  // Handle the "Picture It" button click
  const handlePictureIt = () => {
    clearCurrentAnalysis();
    setShowCamera(true);
  };

  // Handle image selection from gallery
  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowGallery(false);
    clearCurrentAnalysis();
  };

  // Handle the diagnose action
  const handleDiagnose = () => {
    if (selectedImage) {
      analyzeImage(selectedImage);
    }
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
        setSelectedImage(reader.result as string);
        clearCurrentAnalysis();
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
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Plant Diagnosis
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {!selectedImage && !currentAnalysis ? (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Diagnose your plant's health
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Take a picture or upload an image of your plant to get a detailed diagnosis and treatment recommendations.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<CameraIcon />}
            onClick={handlePictureIt}
            sx={{ mt: 2 }}
          >
            Picture It
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Plant Image
              </Typography>
              
              {selectedImage ? (
                <Box sx={{ position: 'relative' }}>
                  <img 
                    src={selectedImage} 
                    alt="Selected plant" 
                    style={{ 
                      width: '100%', 
                      borderRadius: 8,
                      objectFit: 'cover',
                    }} 
                  />
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      startIcon={<CameraIcon />}
                      onClick={handlePictureIt}
                    >
                      Take New Photo
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setShowGallery(true)}
                    >
                      Gallery
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<CameraIcon />}
                    onClick={handlePictureIt}
                  >
                    Take Photo
                  </Button>
                  
                  <Typography variant="body2" color="text.secondary">
                    or
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    component="label"
                  >
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileUpload}
                    />
                  </Button>
                  
                  <Button
                    variant="text"
                    onClick={() => setShowGallery(true)}
                  >
                    Choose from Gallery
                  </Button>
                </Box>
              )}
              
              {selectedImage && !currentAnalysis && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDiagnose}
                    disabled={isAnalyzing}
                    fullWidth
                  >
                    {isAnalyzing ? <CircularProgress size={24} /> : 'Diagnose Plant'}
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={7}>
            {currentAnalysis ? (
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
            ) : (
              <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <InfoIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" align="center">
                  {selectedImage ? 'Click "Diagnose Plant" to analyze your plant' : 'Select or take a photo of your plant to begin'}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}
      
      {/* Camera Dialog */}
      <Dialog 
        open={showCamera} 
        onClose={() => setShowCamera(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Take a Photo</Typography>
            <IconButton onClick={() => setShowCamera(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Camera />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCamera(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              if (capturedImages.length > 0) {
                // Use the most recent image
                const latestImage = capturedImages[capturedImages.length - 1];
                setSelectedImage(latestImage.dataUrl);
                setShowCamera(false);
              }
            }}
            color="primary"
            disabled={capturedImages.length === 0}
          >
            Use Selected Image
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Gallery Dialog */}
      <Dialog 
        open={showGallery} 
        onClose={() => setShowGallery(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Select from Gallery</Typography>
            <IconButton onClick={() => setShowGallery(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {capturedImages.length === 0 ? (
            <Alert severity="info">No images in gallery. Take some photos first!</Alert>
          ) : (
            <Grid container spacing={2}>
              {capturedImages.map((image, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                    onClick={() => handleImageSelect(image.dataUrl)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={image.dataUrl}
                      alt={`Plant image ${index + 1}`}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGallery(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlantDiagnosis; 