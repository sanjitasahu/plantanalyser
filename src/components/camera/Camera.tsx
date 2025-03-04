import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  FlipCameraIos as FlipIcon,
  PhotoLibrary as GalleryIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useCamera } from '../../context/CameraContext';

const Camera: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [showGallery, setShowGallery] = useState(false);
  
  const {
    capturedImages,
    isCapturing,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    captureImage,
    deleteImage,
  } = useCamera();

  useEffect(() => {
    return () => {
      if (isCapturing) {
        stopCamera();
      }
    };
  }, [isCapturing, stopCamera]);

  const handleStartCamera = () => {
    setError(null);
    startCamera();
  };

  const handleCaptureImage = () => {
    captureImage();
  };

  const handleFlipCamera = () => {
    if (isCapturing) {
      stopCamera();
      setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
      setTimeout(() => {
        startCamera();
      }, 300);
    }
  };

  const toggleGallery = () => {
    setShowGallery(prev => !prev);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Plant Camera
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 3,
        }}
      >
        {isCapturing ? (
          <>
            <Box 
              sx={{ 
                width: '100%', 
                position: 'relative',
                borderRadius: 1,
                overflow: 'hidden',
                mb: 2,
              }}
            >
              <video 
                ref={videoRef}
                style={{ 
                  width: '100%', 
                  maxHeight: '70vh',
                  objectFit: 'cover',
                  backgroundColor: '#000',
                }}
                autoPlay
                playsInline
                muted
              />
              
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 16, 
                  left: 0, 
                  right: 0, 
                  display: 'flex', 
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <IconButton 
                  onClick={handleFlipCamera}
                  sx={{ 
                    backgroundColor: 'rgba(0,0,0,0.5)', 
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <FlipIcon />
                </IconButton>
                
                <IconButton 
                  onClick={handleCaptureImage}
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.8)', 
                    color: 'primary.main',
                    p: 2,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                  }}
                >
                  <CameraIcon sx={{ fontSize: 32 }} />
                </IconButton>
                
                <IconButton 
                  onClick={toggleGallery}
                  sx={{ 
                    backgroundColor: 'rgba(0,0,0,0.5)', 
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <GalleryIcon />
                </IconButton>
              </Box>
            </Box>
            
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => stopCamera()}
              sx={{ alignSelf: 'flex-start' }}
            >
              Stop Camera
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<CameraIcon />}
            onClick={handleStartCamera}
            sx={{ py: 1.5, px: 3 }}
          >
            Start Camera
          </Button>
        )}
        
        {/* Hidden canvas for capturing images */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </Paper>
      
      {showGallery && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Captured Images</Typography>
            <Button onClick={toggleGallery} size="small">
              Hide Gallery
            </Button>
          </Box>
          
          {capturedImages.length === 0 ? (
            <Alert severity="info">No images captured yet. Use the camera to take some photos!</Alert>
          ) : (
            <Grid container spacing={2}>
              {capturedImages.map((image, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: 1,
                      overflow: 'hidden',
                      paddingTop: '100%', // 1:1 Aspect ratio
                    }}
                  >
                    <img
                      src={image.dataUrl}
                      alt={`Captured plant ${index + 1}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      onClick={() => deleteImage(image.id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                      }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Camera; 