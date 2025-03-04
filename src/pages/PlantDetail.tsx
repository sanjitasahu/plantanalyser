import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

const PlantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Plant Details
        </Typography>
        <Typography variant="body1">
          This page will display details for plant ID: {id}. It's currently under development.
        </Typography>
      </Box>
    </Container>
  );
};

export default PlantDetail; 