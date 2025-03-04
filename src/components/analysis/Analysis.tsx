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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocalFlorist as PlantIcon,
  Healing as HealthIcon,
  WaterDrop as WaterIcon,
  WbSunny as SunIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useAnalysis } from '../../context/AnalysisContext';
import { useCamera } from '../../context/CameraContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analysis-tabpanel-${index}`}
      aria-labelledby={`analysis-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Analysis: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  
  const { capturedImages } = useCamera();
  const { 
    currentAnalysis, 
    isAnalyzing, 
    error, 
    analyzeImage,
    clearCurrentAnalysis,
  } = useAnalysis();

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    clearCurrentAnalysis();
  };

  const handleAnalyze = () => {
    if (selectedImage) {
      analyzeImage(selectedImage);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
        Plant Analysis
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Select an Image
            </Typography>
            
            {capturedImages.length === 0 ? (
              <Alert severity="info">
                No images available. Please capture some images first.
              </Alert>
            ) : (
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Grid container spacing={1}>
                  {capturedImages.map((image) => (
                    <Grid item xs={6} key={image.id}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          border: selectedImage === image.dataUrl ? '2px solid #4caf50' : 'none',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                        onClick={() => handleImageSelect(image.dataUrl)}
                      >
                        <CardMedia
                          component="img"
                          height="100"
                          image={image.dataUrl}
                          alt="Plant image"
                          sx={{ objectFit: 'cover' }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing}
                fullWidth
              >
                {isAnalyzing ? <CircularProgress size={24} /> : 'Analyze Plant'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 0, height: '100%' }}>
            {!currentAnalysis ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <PlantIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Select an image and click "Analyze Plant" to get started
                </Typography>
              </Box>
            ) : (
              <Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    variant="fullWidth"
                  >
                    <Tab label="Identification" icon={<PlantIcon />} />
                    <Tab label="Health" icon={<HealthIcon />} />
                    <Tab label="Care Tips" icon={<WaterIcon />} />
                  </Tabs>
                </Box>
                
                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    {selectedImage && (
                      <Box sx={{ width: { xs: '100%', sm: 200 }, flexShrink: 0 }}>
                        <img 
                          src={selectedImage} 
                          alt="Selected plant" 
                          style={{ 
                            width: '100%', 
                            borderRadius: 8,
                            objectFit: 'cover',
                          }} 
                        />
                      </Box>
                    )}
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" gutterBottom>
                        {currentAnalysis.identification.name}
                      </Typography>
                      
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {currentAnalysis.identification.scientificName}
                      </Typography>
                      
                      <Typography variant="body1" paragraph>
                        {currentAnalysis.identification.description}
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Confidence: {currentAnalysis.identification.confidence}%
                      </Typography>
                      
                      {currentAnalysis.identification.tags && (
                        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {currentAnalysis.identification.tags.map((tag, index) => (
                            <Chip key={index} label={tag} size="small" />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </TabPanel>
                
                <TabPanel value={tabValue} index={1}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        Overall Health:
                      </Typography>
                      <Chip 
                        label={currentAnalysis.health.status}
                        color={getHealthStatusColor(currentAnalysis.health.status) as any}
                        icon={getHealthStatusIcon(currentAnalysis.health.status)}
                        sx={{ ml: 2 }}
                      />
                    </Box>
                    
                    <Typography variant="body1" paragraph>
                      {currentAnalysis.health.summary}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Issues Detected:
                    </Typography>
                    
                    {currentAnalysis.health.issues.length === 0 ? (
                      <Alert severity="success" sx={{ mt: 1 }}>
                        No issues detected. Your plant appears to be healthy!
                      </Alert>
                    ) : (
                      <List>
                        {currentAnalysis.health.issues.map((issue, index) => (
                          <Accordion key={index} sx={{ mb: 1 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                <WarningIcon 
                                  color={issue.severity === 'high' ? 'error' : 'warning'} 
                                  sx={{ mr: 1, fontSize: 20 }} 
                                />
                                {issue.name}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography variant="body2">
                                {issue.description}
                              </Typography>
                              {issue.solution && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="subtitle2">Solution:</Typography>
                                  <Typography variant="body2">{issue.solution}</Typography>
                                </Box>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </List>
                    )}
                  </Box>
                </TabPanel>
                
                <TabPanel value={tabValue} index={2}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <WaterIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Watering" 
                        secondary={currentAnalysis.care.watering} 
                      />
                    </ListItem>
                    
                    <Divider variant="inset" component="li" />
                    
                    <ListItem>
                      <ListItemIcon>
                        <SunIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Light Requirements" 
                        secondary={currentAnalysis.care.light} 
                      />
                    </ListItem>
                    
                    <Divider variant="inset" component="li" />
                    
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Soil & Fertilizer" 
                        secondary={currentAnalysis.care.soil} 
                      />
                    </ListItem>
                    
                    <Divider variant="inset" component="li" />
                    
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Temperature & Humidity" 
                        secondary={currentAnalysis.care.temperature} 
                      />
                    </ListItem>
                  </List>
                  
                  {currentAnalysis.care.additionalTips && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" gutterBottom>
                        Additional Tips:
                      </Typography>
                      <Typography variant="body2">
                        {currentAnalysis.care.additionalTips}
                      </Typography>
                    </>
                  )}
                </TabPanel>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analysis; 