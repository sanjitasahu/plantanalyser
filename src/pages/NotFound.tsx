import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { SentimentDissatisfied as SadIcon, Home as HomeIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <SadIcon color="primary" sx={{ fontSize: 64, mb: 2 }} />
          <Typography component="h1" variant="h4" gutterBottom>
            404 - Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Oops! The page you are looking for doesn't exist or has been moved.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
          >
            Back to Home
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound; 