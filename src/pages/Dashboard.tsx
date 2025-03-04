import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Box 
} from '@mui/material';
import { 
  LocalFlorist as PlantIcon, 
  CameraAlt as CameraIcon, 
  Search as SearchIcon, 
  Add as AddIcon,
  SmartToy as AIIcon
} from '@mui/icons-material';

import { usePlants } from '../context/PlantContext';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { plants } = usePlants();
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name || 'Plant Lover'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your plant care assistant is ready to help you maintain a healthy garden.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3} md={2.4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <CameraIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h6" component="h3">
                    Capture Plant
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    component={Link} 
                    to="/camera" 
                    fullWidth 
                    variant="contained" 
                    color="primary"
                  >
                    Open Camera
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2.4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <SearchIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h6" component="h3">
                    Analyze Plant
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    component={Link} 
                    to="/analyze" 
                    fullWidth 
                    variant="contained" 
                    color="primary"
                  >
                    Start Analysis
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2.4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <PlantIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h6" component="h3">
                    View Plants
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    component={Link} 
                    to="/plants" 
                    fullWidth 
                    variant="contained" 
                    color="primary"
                  >
                    My Plants
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2.4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <AddIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h6" component="h3">
                    Add Plant
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    component={Link} 
                    to="/add-plant" 
                    fullWidth 
                    variant="contained" 
                    color="primary"
                  >
                    Add New
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2.4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <AIIcon color="secondary" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h6" component="h3">
                    Gemini AI Demo
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    component={Link} 
                    to="/gemini-demo" 
                    fullWidth 
                    variant="contained" 
                    color="secondary"
                  >
                    Try Demo
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Plants */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              Your Plants
            </Typography>
            <Button 
              component={Link} 
              to="/plants" 
              variant="outlined" 
              color="primary"
              endIcon={<PlantIcon />}
            >
              View All
            </Button>
          </Box>
          
          {plants.length === 0 ? (
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                You haven't added any plants yet.
              </Typography>
              <Button 
                component={Link} 
                to="/add-plant" 
                variant="contained" 
                color="primary"
                startIcon={<AddIcon />}
                sx={{ mt: 1 }}
              >
                Add Your First Plant
              </Button>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {plants.slice(0, 4).map((plant) => (
                <Grid item key={plant.id} xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box 
                      sx={{ 
                        height: 140, 
                        backgroundImage: plant.images.length > 0 
                          ? `url(${plant.images[0]})` 
                          : 'none',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {plant.images.length === 0 && (
                        <PlantIcon sx={{ fontSize: 48, color: 'rgba(76, 175, 80, 0.5)' }} />
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {plant.name}
                      </Typography>
                      {plant.species && (
                        <Typography variant="body2" color="text.secondary">
                          {plant.species}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button 
                        component={Link} 
                        to={`/plants/${plant.id}`} 
                        size="small" 
                        color="primary"
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 