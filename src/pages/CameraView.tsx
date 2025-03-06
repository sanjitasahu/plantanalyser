import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Paper,
  AppBar,
  Toolbar,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  CameraAlt as CameraIcon,
  FlipCameraAndroid as FlipCameraIcon,
  PhotoLibrary as GalleryIcon,
  Close as CloseIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';

import { useAnalysis } from '../context/AnalysisContext';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CameraView: React.FC = () => {
  const navigate = useNavigate();
  const { setImage, clearCurrentAnalysis } = useAnalysis();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError(null);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Could not access camera. Please check permissions and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        setPreviewDialogOpen(true);
      }
    }
  };

  const openGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
        setPreviewDialogOpen(true);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const confirmImage = () => {
    if (capturedImage) {
      setImage(capturedImage);
      navigate('/analyze');
    }
    setPreviewDialogOpen(false);
  };

  const retakeImage = () => {
    setCapturedImage(null);
    setPreviewDialogOpen(false);
  };

  // Handle back button click
  const handleBackClick = () => {
    clearCurrentAnalysis(); // Clear analysis data when navigating away
    navigate(-1);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#000' }}>
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
            Camera
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Camera View */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {isLoading ? (
          <CircularProgress color="primary" />
        ) : cameraError ? (
          <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
            <Typography variant="h6" color="error" gutterBottom>
              Camera Error
            </Typography>
            <Typography variant="body1" paragraph>
              {cameraError}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={startCamera}
            >
              Try Again
            </Button>
          </Paper>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            
            {/* Camera frame overlay */}
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: '2px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '12px',
                margin: '40px',
                pointerEvents: 'none',
                boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.2)'
              }}
            />
            
            {/* Capture hint text */}
            <Typography 
              variant="body2" 
              sx={{ 
                position: 'absolute', 
                top: 20, 
                left: 0, 
                right: 0, 
                textAlign: 'center',
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.6)'
              }}
            >
              Position the plant in the frame
            </Typography>
          </>
        )}
        
        {/* Hidden canvas for capturing images */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {/* Hidden file input for gallery */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Box>

      {/* Camera Controls */}
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-around', 
          alignItems: 'center',
          bgcolor: 'rgba(0, 0, 0, 0.5)'
        }}
      >
        <IconButton 
          color="inherit" 
          onClick={openGallery}
          sx={{ color: 'white' }}
        >
          <GalleryIcon fontSize="large" />
        </IconButton>
        
        <Fab 
          color="primary" 
          onClick={captureImage}
          disabled={isLoading || !!cameraError}
          sx={{ 
            width: 70, 
            height: 70,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}
        >
          <CameraIcon fontSize="large" />
        </Fab>
        
        <IconButton 
          color="inherit" 
          onClick={switchCamera}
          disabled={isLoading || !!cameraError}
          sx={{ color: 'white' }}
        >
          <FlipCameraIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Image Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { 
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: '#000'
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#000', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Preview</Typography>
          <IconButton edge="end" color="inherit" onClick={retakeImage} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, bgcolor: '#000' }}>
          {capturedImage && (
            <Box 
              component="img" 
              src={capturedImage} 
              alt="Captured plant" 
              sx={{ 
                width: '100%',
                display: 'block'
              }} 
            />
          )}
        </DialogContent>
        
        <DialogActions sx={{ bgcolor: '#000', justifyContent: 'space-between', px: 2, py: 1.5 }}>
          <Button 
            onClick={retakeImage} 
            color="inherit"
            startIcon={<CloseIcon />}
            sx={{ color: 'white' }}
          >
            Retake
          </Button>
          <Button 
            onClick={confirmImage} 
            variant="contained" 
            color="primary"
            startIcon={<CheckIcon />}
          >
            Use Photo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CameraView; 