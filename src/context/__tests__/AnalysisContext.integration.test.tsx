import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AnalysisProvider, useAnalysis } from '../AnalysisContext';
import * as GeminiService from '../../services/GeminiService';

// Mock the GeminiService
jest.mock('../../services/GeminiService', () => ({
  identifyPlant: jest.fn(),
  assessPlantHealth: jest.fn(),
  getPlantCareRecommendations: jest.fn(),
}));

// Sample test data
const sampleImageUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAP/2Q==';

// Test component that uses the AnalysisContext
const TestComponent = () => {
  const { analyzeImage, currentAnalysis, isAnalyzing, error } = useAnalysis();

  return (
    <div>
      <button onClick={() => analyzeImage(sampleImageUrl)}>Analyze Image</button>
      {isAnalyzing && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">{error}</div>}
      {currentAnalysis && (
        <div data-testid="analysis-result">
          <h2>{currentAnalysis.identification.name}</h2>
          <p>{currentAnalysis.health.summary}</p>
        </div>
      )}
    </div>
  );
};

describe('AnalysisContext Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should successfully analyze an image and update the context', async () => {
    // Mock the GeminiService responses
    const mockIdentification = {
      name: 'Monstera Deliciosa',
      scientificName: 'Monstera deliciosa',
      confidence: 95,
      description: 'A popular tropical houseplant with distinctive split leaves',
      tags: ['tropical', 'houseplant', 'foliage'],
    };

    const mockHealth = {
      status: 'Healthy',
      summary: 'The plant appears to be in good health with no visible issues.',
      issues: [],
    };

    const mockCare = {
      watering: 'Water once a week, allowing soil to dry out between waterings.',
      light: 'Bright, indirect light. Avoid direct sunlight which can scorch the leaves.',
      soil: 'Well-draining potting mix with peat moss and perlite.',
      temperature: 'Prefers temperatures between 65-85°F (18-29°C) with high humidity.',
      additionalTips: 'Wipe leaves occasionally to remove dust and improve photosynthesis.',
    };

    (GeminiService.identifyPlant as jest.Mock).mockResolvedValue(mockIdentification);
    (GeminiService.assessPlantHealth as jest.Mock).mockResolvedValue(mockHealth);
    (GeminiService.getPlantCareRecommendations as jest.Mock).mockResolvedValue(mockCare);

    // Render the test component with the AnalysisProvider
    render(
      <AnalysisProvider>
        <TestComponent />
      </AnalysisProvider>
    );

    // Click the analyze button
    const analyzeButton = screen.getByText('Analyze Image');
    act(() => {
      analyzeButton.click();
    });

    // Check that loading state is shown
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for the analysis to complete
    await waitFor(() => {
      expect(screen.getByTestId('analysis-result')).toBeInTheDocument();
    });

    // Verify the result is displayed correctly
    expect(screen.getByText('Monstera Deliciosa')).toBeInTheDocument();
    expect(screen.getByText('The plant appears to be in good health with no visible issues.')).toBeInTheDocument();

    // Verify that the service functions were called with the correct parameters
    expect(GeminiService.identifyPlant).toHaveBeenCalledWith(sampleImageUrl);
    expect(GeminiService.assessPlantHealth).toHaveBeenCalledWith(sampleImageUrl);
    expect(GeminiService.getPlantCareRecommendations).toHaveBeenCalledWith('Monstera Deliciosa', 'Monstera deliciosa');
  });

  it('should handle errors during analysis', async () => {
    // Mock an error in the GeminiService
    (GeminiService.identifyPlant as jest.Mock).mockRejectedValue(new Error('API error'));

    // Render the test component with the AnalysisProvider
    render(
      <AnalysisProvider>
        <TestComponent />
      </AnalysisProvider>
    );

    // Click the analyze button
    const analyzeButton = screen.getByText('Analyze Image');
    act(() => {
      analyzeButton.click();
    });

    // Check that loading state is shown
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    // Verify the error message
    expect(screen.getByTestId('error').textContent).toContain('Error analyzing image');
  });
}); 