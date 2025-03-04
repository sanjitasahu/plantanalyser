import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalysisResult, PlantIdentification, PlantHealth } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { identifyPlant, assessPlantHealth, getPlantCareRecommendations } from '../services/GeminiService';

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

      // Use the GeminiService to analyze the image
      const identification = await identifyPlant(imageUrl);
      const health = await assessPlantHealth(imageUrl);
      const care = await getPlantCareRecommendations(
        identification.name, 
        identification.scientificName
      );

      // Create analysis result
      const newAnalysis: AnalysisResult = {
        id: uuidv4(),
        plantId: plantId || '',
        date: new Date().toISOString(),
        imageUrl,
        identification,
        health,
        care
      };

      setCurrentAnalysis(newAnalysis);
      setAnalysisResults(prev => [...prev, newAnalysis]);

      return newAnalysis;
    } catch (err) {
      setError('Error analyzing image. Please try again.');
      console.error('Analysis error:', err);
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