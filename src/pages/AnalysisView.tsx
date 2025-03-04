import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AnalysisView: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Plant Analysis
        </Typography>
        <Typography variant="body1">
          This page will allow you to analyze your plant images. It's currently under development.
        </Typography>
      </Box>
    </Container>
  );
};

export default AnalysisView; 