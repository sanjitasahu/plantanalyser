import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const CameraView: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Camera
        </Typography>
        <Typography variant="body1">
          This page will allow you to take photos of your plants. It's currently under development.
        </Typography>
      </Box>
    </Container>
  );
};

export default CameraView; 