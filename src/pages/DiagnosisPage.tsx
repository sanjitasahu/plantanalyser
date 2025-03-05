import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import PlantDiagnosis from '../components/analysis/PlantDiagnosis';

const DiagnosisPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Plant Health Diagnosis
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Diagnose your plant's health issues and get personalized care recommendations
        </Typography>
        
        <PlantDiagnosis />
      </Box>
    </Container>
  );
};

export default DiagnosisPage; 