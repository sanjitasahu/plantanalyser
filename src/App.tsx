import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
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
import NotFound from './pages/NotFound';
import GeminiDemo from './pages/GeminiDemo';

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

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/plants" element={
        <ProtectedRoute>
          <PlantList />
        </ProtectedRoute>
      } />
      
      <Route path="/plants/:id" element={
        <ProtectedRoute>
          <PlantDetail />
        </ProtectedRoute>
      } />
      
      <Route path="/add-plant" element={
        <ProtectedRoute>
          <AddPlant />
        </ProtectedRoute>
      } />
      
      <Route path="/camera" element={
        <ProtectedRoute>
          <CameraView />
        </ProtectedRoute>
      } />
      
      <Route path="/analyze" element={
        <ProtectedRoute>
          <AnalysisView />
        </ProtectedRoute>
      } />
      
      <Route path="/gemini-demo" element={<GeminiDemo />} />
      
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