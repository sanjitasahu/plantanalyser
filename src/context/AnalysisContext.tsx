import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalysisResult, PlantIdentification, PlantHealth } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AnalysisContextType {
  analysisResults: AnalysisResult[];
  currentAnalysis: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  analyzeImage: (imageUrl: string, plantId?: string) => Promise<AnalysisResult | undefined>;
  getAnalysisHistory: (plantId: string) => AnalysisResult[];
  clearCurrentAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

interface AnalysisProviderProps {
  children: ReactNode;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({ children }) => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load analysis results from localStorage
  React.useEffect(() => {
    const storedResults = localStorage.getItem('analysisResults');
    if (storedResults) {
      setAnalysisResults(JSON.parse(storedResults));
    }
  }, []);

  // Save analysis results to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('analysisResults', JSON.stringify(analysisResults));
  }, [analysisResults]);

  const analyzeImage = async (imageUrl: string, plantId?: string) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // In a real app, this would call the Gemini API
      // For now, we'll simulate a response with mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock identification data
      const mockIdentification: PlantIdentification = {
        name: 'Monstera Deliciosa',
        scientificName: 'Monstera deliciosa',
        confidence: 0.92,
        description: 'The Monstera deliciosa is a species of flowering plant native to tropical forests of southern Mexico, south to Panama.',
        tags: ['tropical', 'houseplant', 'large leaves']
      };

      // Mock health assessment
      const mockHealth: PlantHealth = {
        status: 'Healthy',
        summary: 'Your plant appears to be in good health overall.',
        issues: plantId ? [] : [
          {
            name: 'Leaf Browning',
            description: 'Some leaves show slight browning at the edges',
            severity: 'low',
            solution: 'Increase humidity and ensure consistent watering'
          }
        ]
      };

      // Create analysis result
      const newAnalysis: AnalysisResult = {
        id: uuidv4(),
        plantId: plantId || '',
        date: new Date().toISOString(),
        imageUrl,
        identification: mockIdentification,
        health: mockHealth,
        care: {
          watering: 'Water once a week, allowing soil to dry out between waterings',
          light: 'Place in bright, indirect light',
          soil: 'Well-draining potting mix with peat moss and perlite',
          temperature: 'Maintain temperature between 65-85°F and humidity around 60%',
          additionalTips: 'Fertilize monthly during growing season'
        }
      };

      setCurrentAnalysis(newAnalysis);
      setAnalysisResults(prev => [...prev, newAnalysis]);

      return newAnalysis;
    } catch (err) {
      setError('Failed to analyze image');
      console.error(err);
      return undefined;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAnalysisHistory = (plantId: string) => {
    return analysisResults.filter(result => result.plantId === plantId);
  };

  const clearCurrentAnalysis = () => {
    setCurrentAnalysis(null);
  };

  return (
    <AnalysisContext.Provider
      value={{
        analysisResults,
        currentAnalysis,
        isAnalyzing,
        error,
        analyzeImage,
        getAnalysisHistory,
        clearCurrentAnalysis
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}; 