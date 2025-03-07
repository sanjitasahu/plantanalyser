import React, { useState, useRef } from 'react';
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
  Slide,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  CameraAlt as CameraIcon,
  PhotoLibrary as GalleryIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Upload as UploadIcon,
  Image as ImageIcon
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

const ImageUploadView: React.FC = () => {
  const navigate = useNavigate();
  const { setImage, clearCurrentAnalysis } = useAnalysis();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Open file picker for gallery images
  const openGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Open camera through file input with capture attribute
  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // Handle file selection (from gallery or camera)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      setUploadError(null);
      setIsLoading(true);
      
      // Check file size
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setUploadError('Image file is too large. Please use an image smaller than 10MB.');
        setIsLoading(false);
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
        setIsLoading(false);
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
        setPreviewDialogOpen(true);
        setIsLoading(false);
      };
      
      reader.onerror = () => {
        setUploadError('Error reading file. Please try again with a different image.');
        setIsLoading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Confirm the selected image and proceed to analysis
  const confirmImage = () => {
    if (capturedImage) {
      setImage(capturedImage);
      setPreviewDialogOpen(false);
      navigate('/analyze');
    }
  };

  // Cancel the preview and allow selecting another image
  const cancelPreview = () => {
    setCapturedImage(null);
    setPreviewDialogOpen(false);
  };

  // Handle back button click
  const handleBackClick = () => {
    clearCurrentAnalysis();
    navigate(-1);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
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
            Identify Plant
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 2, 
            textAlign: 'center',
            mb: 3
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', color: '#333' }}>
            Upload a Plant Photo
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Take a clear photo of the plant you want to identify, or select an existing image from your gallery.
          </Typography>
          
          {uploadError && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: '#FFEBEE', 
                borderRadius: 2,
                border: '1px solid #FFCDD2'
              }}
            >
              <Typography variant="body2" color="error">
                {uploadError}
              </Typography>
            </Paper>
          )}
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Card 
                elevation={2} 
                sx={{ 
                  borderRadius: 2,
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <CardActionArea 
                  onClick={openCamera}
                  sx={{ 
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: '#E8F5E9', 
                      borderRadius: '50%', 
                      p: 2,
                      mb: 2
                    }}
                  >
                    <CameraIcon sx={{ fontSize: 40, color: '#4CAF50' }} />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Take Photo
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use your camera to take a photo of the plant
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card 
                elevation={2} 
                sx={{ 
                  borderRadius: 2,
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <CardActionArea 
                  onClick={openGallery}
                  sx={{ 
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: '#E3F2FD', 
                      borderRadius: '50%', 
                      p: 2,
                      mb: 2
                    }}
                  >
                    <GalleryIcon sx={{ fontSize: 40, color: '#2196F3' }} />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Choose from Gallery
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Select an existing photo from your device
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Paper>
        
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
          For best results, ensure the plant is well-lit and the photo is clear.
        </Typography>
        
        {/* Hidden file inputs */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Box>
      
      {/* Loading Overlay */}
      {isLoading && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <Paper sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body1">Processing image...</Typography>
          </Paper>
        </Box>
      )}
      
      {/* Image Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Confirm Image</Typography>
          <IconButton onClick={cancelPreview}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {capturedImage && (
            <Box 
              component="img" 
              src={capturedImage} 
              alt="Captured plant" 
              sx={{ 
                width: '100%', 
                borderRadius: 1,
                maxHeight: '60vh',
                objectFit: 'contain'
              }} 
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={cancelPreview} 
            color="inherit"
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmImage} 
            variant="contained" 
            color="primary"
            startIcon={<CheckIcon />}
          >
            Analyze Plant
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageUploadView; 