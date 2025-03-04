import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AddPlant: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Plant
        </Typography>
        <Typography variant="body1">
          This page will allow you to add a new plant to your collection. It's currently under development.
        </Typography>
      </Box>
    </Container>
  );
};

export default AddPlant; 