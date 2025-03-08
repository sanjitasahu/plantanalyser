import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { PlantProvider } from './context/PlantContext';
import { AnalysisProvider } from './context/AnalysisContext';
import { CameraProvider } from './context/CameraContext';

// Pages (to be created)
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PlantList from './pages/PlantList';
import PlantDetail from './pages/PlantDetail';
import AddPlant from './pages/AddPlant';
import CameraView from './pages/CameraView';
import AnalysisView from './pages/AnalysisView';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import GeminiDemo from './pages/GeminiDemo';
import ExpertChat from './pages/ExpertChat';
import ImageUploadView from './pages/ImageUploadView';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Green color for plants
    },
    secondary: {
      main: '#81c784', // Lighter green
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/plants" element={<PlantList />} />
      <Route path="/plants/:id" element={<PlantDetail />} />
      <Route path="/add-plant" element={<AddPlant />} />
      <Route path="/camera" element={<CameraView />} />
      <Route path="/upload-image" element={<ImageUploadView />} />
      <Route path="/analyze" element={<AnalysisView />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/gemini-demo" element={<GeminiDemo />} />
      <Route path="/expert-chat" element={<ExpertChat />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <PlantProvider>
            <AnalysisProvider>
              <CameraProvider>
                <AppRoutes />
              </CameraProvider>
            </AnalysisProvider>
          </PlantProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App; 