import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import GeminiApiDemo from '../components/demo/GeminiApiDemo';

const GeminiDemo: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Plant Analyzer - Gemini API Demo
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Test the Gemini AI integration for plant identification, health assessment, and care recommendations
        </Typography>
        
        <GeminiApiDemo />
      </Box>
    </Container>
  );
};

export default GeminiDemo; 