import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalysisResult, PlantIdentification, PlantHealth } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { identifyPlant, assessPlantHealth, getPlantCareRecommendations } from '../services/GeminiService';

// Maximum number of analysis results to store in localStorage
const MAX_STORED_RESULTS = 20;

// Helper function to safely access localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  }
};

// Helper function to compress image data
const compressImageData = (base64Image: string, quality = 0.7, maxWidth = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create an image element
    const img = new Image();
    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw the image on the canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with reduced quality
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };
    
    // Set the source of the image
    img.src = base64Image;
  });
};

interface AnalysisContextType {
  analysisResults: AnalysisResult[];
  currentAnalysis: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  analyzeImage: (imageUrl: string, plantId?: string) => Promise<AnalysisResult | undefined>;
  getAnalysisHistory: (plantId: string) => AnalysisResult[];
  clearCurrentAnalysis: () => void;
  currentImage: string | null;
  setImage: (imageUrl: string | null) => void;
  analyzeCurrentImage: () => Promise<AnalysisResult | undefined>;
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
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  // Load analysis results from localStorage
  React.useEffect(() => {
    const storedResults = safeLocalStorage.getItem('analysisResults');
    if (storedResults) {
      try {
        setAnalysisResults(JSON.parse(storedResults));
      } catch (e) {
        console.error('Error parsing stored analysis results:', e);
        // Reset to empty array if parsing fails
        setAnalysisResults([]);
      }
    }
  }, []);

  // Save analysis results to localStorage whenever they change
  React.useEffect(() => {
    // Limit the number of stored results to prevent quota issues
    const resultsToStore = analysisResults.slice(-MAX_STORED_RESULTS);
    
    // Only attempt to store if we have results
    if (resultsToStore.length > 0) {
      const success = safeLocalStorage.setItem('analysisResults', JSON.stringify(resultsToStore));
      
      // If storage failed, update the state to use the limited results
      if (!success && resultsToStore.length !== analysisResults.length) {
        setAnalysisResults(resultsToStore);
      }
    }
  }, [analysisResults]);

  const setImage = (imageUrl: string | null) => {
    if (imageUrl) {
      // Try to compress the image before setting it
      compressImageData(imageUrl, 0.7)
        .then(compressedImage => {
          setCurrentImage(compressedImage);
        })
        .catch(error => {
          console.error('Error compressing image:', error);
          // Use the original image if compression fails
          setCurrentImage(imageUrl);
        });
    } else {
      setCurrentImage(null);
    }
  };

  const analyzeImage = async (imageUrl: string, plantId?: string) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Step 1: Identify the plant
      let identification: PlantIdentification;
      try {
        identification = await identifyPlant(imageUrl);
        
        // Check if we got a quota exceeded error
        if (identification.name.includes('API Quota Exceeded')) {
          setError('API quota exceeded. Please try again later or contact support for assistance.');
          return undefined;
        }
      } catch (error: any) {
        if (error.message && (
          error.message.includes('quota') || 
          error.message.includes('limit') || 
          error.message.includes('exceeded') ||
          error.message.includes('RESOURCE_EXHAUSTED')
        )) {
          setError('API quota exceeded. Please try again later or contact support for assistance.');
          return undefined;
        }
        throw error;
      }
      
      // Step 2: Assess plant health
      let health: PlantHealth;
      try {
        health = await assessPlantHealth(imageUrl);
        
        // Check if we got a quota exceeded error
        if (health.summary.includes('API Quota Exceeded')) {
          setError('API quota exceeded. Please try again later or contact support for assistance.');
          return undefined;
        }
      } catch (error: any) {
        if (error.message && (
          error.message.includes('quota') || 
          error.message.includes('limit') || 
          error.message.includes('exceeded') ||
          error.message.includes('RESOURCE_EXHAUSTED')
        )) {
          setError('API quota exceeded. Please try again later or contact support for assistance.');
          return undefined;
        }
        throw error;
      }
      
      // Step 3: Get care recommendations
      let care;
      try {
        care = await getPlantCareRecommendations(
          identification.name, 
          identification.scientificName
        );
        
        // Check if we got a quota exceeded error
        if (care.summary.includes('API Quota Exceeded')) {
          setError('API quota exceeded. Please try again later or contact support for assistance.');
          return undefined;
        }
      } catch (error: any) {
        if (error.message && (
          error.message.includes('quota') || 
          error.message.includes('limit') || 
          error.message.includes('exceeded') ||
          error.message.includes('RESOURCE_EXHAUSTED')
        )) {
          setError('API quota exceeded. Please try again later or contact support for assistance.');
          return undefined;
        }
        throw error;
      }

      // Compress the image for storage
      let compressedImageUrl = imageUrl;
      try {
        compressedImageUrl = await compressImageData(imageUrl, 0.6);
      } catch (compressionError) {
        console.error('Error compressing image:', compressionError);
        // Continue with the original image if compression fails
      }

      // Create analysis result
      const newAnalysis: AnalysisResult = {
        id: uuidv4(),
        plantId: plantId || '',
        date: new Date().toISOString(),
        imageUrl: compressedImageUrl, // Use the compressed image
        identification,
        health,
        care
      };

      setCurrentAnalysis(newAnalysis);
      
      // Update analysis results with storage quota management
      try {
        // Add the new analysis to the results
        const updatedResults = [...analysisResults, newAnalysis];
        
        // Try to store the updated results
        const jsonString = JSON.stringify(updatedResults);
        
        // If the string is too large, we need to reduce the number of stored results
        try {
          const success = safeLocalStorage.setItem('analysisResults', jsonString);
          
          if (success) {
            // If storage succeeded, update the state
            setAnalysisResults(updatedResults);
          } else {
            // If storage failed, limit the number of results
            const limitedResults = updatedResults.slice(-MAX_STORED_RESULTS/2);
            
            // Try again with fewer results
            const success = safeLocalStorage.setItem('analysisResults', JSON.stringify(limitedResults));
            
            // Update state with what we could store
            setAnalysisResults(success ? limitedResults : [newAnalysis]);
          }
        } catch (storageError) {
          console.error('Error storing analysis results:', storageError);
          // Just keep the current analysis in state
          setAnalysisResults([newAnalysis]);
        }
      } catch (e) {
        console.error('Error updating analysis results:', e);
        // Don't let storage errors prevent the analysis from being returned
      }

      return newAnalysis;
    } catch (err: any) {
      console.error('Analysis error:', err);
      
      // Check for quota exceeded errors
      if (err.message && (
        err.message.includes('quota') || 
        err.message.includes('limit') || 
        err.message.includes('exceeded') ||
        err.message.includes('RESOURCE_EXHAUSTED')
      )) {
        setError('API quota exceeded. Please try again later or contact support for assistance.');
      } else {
        setError('Error analyzing image. Please try again with a clearer photo.');
      }
      
      return undefined;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeCurrentImage = async () => {
    if (!currentImage) {
      setError('No image to analyze');
      return undefined;
    }
    return analyzeImage(currentImage);
  };

  const getAnalysisHistory = (plantId: string) => {
    // Filter results for the specific plant
    return analysisResults.filter(result => result.plantId === plantId);
  };

  // Function to clear the current analysis
  const clearCurrentAnalysis = () => {
    setCurrentAnalysis(null);
    setError(null);
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
        clearCurrentAnalysis,
        currentImage,
        setImage,
        analyzeCurrentImage
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