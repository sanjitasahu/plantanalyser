import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  identifyPlant, 
  assessPlantHealth, 
  getPlantCareRecommendations 
} from '../GeminiService';

// Mock the GoogleGenerativeAI module
jest.mock('@google/generative-ai', () => {
  // Mock implementation of generateContent
  const mockGenerateContent = jest.fn();
  
  // Mock implementation of the model
  const mockModel = {
    generateContent: mockGenerateContent
  };
  
  // Mock implementation of getGenerativeModel
  const mockGetGenerativeModel = jest.fn().mockReturnValue(mockModel);
  
  // Mock implementation of the GoogleGenerativeAI class
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: mockGetGenerativeModel
      };
    }),
    HarmCategory: {
      HARM_CATEGORY_HARASSMENT: 'HARM_CATEGORY_HARASSMENT',
      HARM_CATEGORY_HATE_SPEECH: 'HARM_CATEGORY_HATE_SPEECH',
      HARM_CATEGORY_SEXUALLY_EXPLICIT: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      HARM_CATEGORY_DANGEROUS_CONTENT: 'HARM_CATEGORY_DANGEROUS_CONTENT'
    },
    HarmBlockThreshold: {
      BLOCK_MEDIUM_AND_ABOVE: 'BLOCK_MEDIUM_AND_ABOVE'
    }
  };
});

// Sample base64 image for testing
const sampleBase64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAP/2Q==';

describe('GeminiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('identifyPlant', () => {
    it('should successfully identify a plant', async () => {
      // Mock the response from the Gemini API
      const mockResponse = {
        response: {
          text: () => JSON.stringify({
            name: 'Monstera Deliciosa',
            scientificName: 'Monstera deliciosa',
            confidence: 95,
            description: 'A popular tropical houseplant with distinctive split leaves',
            tags: ['tropical', 'houseplant', 'foliage']
          })
        }
      };

      // Set up the mock to return our mock response
      const mockGenerateContent = require('@google/generative-ai').GoogleGenerativeAI().getGenerativeModel().generateContent;
      mockGenerateContent.mockResolvedValue(mockResponse);

      // Call the function
      const result = await identifyPlant(sampleBase64Image);
      
      expect(result).toEqual({
        name: 'Monstera Deliciosa',
        scientificName: 'Monstera deliciosa',
        confidence: 95,
        description: 'A popular tropical houseplant with distinctive split leaves',
        tags: ['tropical', 'houseplant', 'foliage']
      });

      // Verify the mock was called with the correct model name
      const mockGetGenerativeModel = require('@google/generative-ai').GoogleGenerativeAI().getGenerativeModel;
      expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash-8b' });
      expect(mockGenerateContent).toHaveBeenCalled();
    });

    it('should handle errors and return fallback data', async () => {
      // Mock the API to throw an error
      const mockGenerateContent = require('@google/generative-ai').GoogleGenerativeAI().getGenerativeModel().generateContent;
      mockGenerateContent.mockRejectedValue(new Error('API error'));

      // Call the function
      const result = await identifyPlant(sampleBase64Image);
      
      // Verify fallback data is returned
      expect(result).toEqual({
        name: 'Identification Failed',
        scientificName: 'Error processing image',
        confidence: 0,
        description: 'There was an error analyzing this image. Please try again with a clearer image of the plant.',
        tags: ['error']
      });
    });
  });

  describe('assessPlantHealth', () => {
    it('should successfully assess plant health', async () => {
      // Mock the response from the Gemini API
      const mockResponse = {
        response: {
          text: () => JSON.stringify({
            status: 'Healthy',
            summary: 'The plant appears to be in good health with no visible issues.',
            issues: []
          })
        }
      };

      // Set up the mock to return our mock response
      const mockGenerateContent = require('@google/generative-ai').GoogleGenerativeAI().getGenerativeModel().generateContent;
      mockGenerateContent.mockResolvedValue(mockResponse);

      // Call the function
      const result = await assessPlantHealth(sampleBase64Image);
      
      expect(result).toEqual({
        status: 'Healthy',
        summary: 'The plant appears to be in good health with no visible issues.',
        issues: []
      });

      // Verify the mock was called with the correct model name
      const mockGetGenerativeModel = require('@google/generative-ai').GoogleGenerativeAI().getGenerativeModel;
      expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash-8b' });
      expect(mockGenerateContent).toHaveBeenCalled();
    });

    it('should handle errors and return fallback data', async () => {
      // Mock the API to throw an error
      const mockGenerateContent = require('@google/generative-ai').GoogleGenerativeAI().getGenerativeModel().generateContent;
      mockGenerateContent.mockRejectedValue(new Error('API error'));

      // Call the function
      const result = await assessPlantHealth(sampleBase64Image);
      
      // Verify fallback data is returned
      expect(result).toEqual({
        status: 'Needs attention',
        summary: 'There was an error analyzing this image. Please try again with a clearer image of the plant.',
        issues: [
          {
            name: 'Analysis Error',
            severity: 'medium',
            description: 'The system encountered an error while analyzing this plant.',
            solution: 'Try taking a clearer photo with good lighting, focusing on the plant\'s leaves and stems.'
          }
        ]
      });
    });
  });

  describe('getPlantCareRecommendations', () => {
    it('should successfully get plant care recommendations', async () => {
      // Mock the response from the Gemini API
      const mockResponse = {
        response: {
          text: () => JSON.stringify({
            watering: 'Water once a week, allowing soil to dry out between waterings.',
            light: 'Bright, indirect light. Avoid direct sunlight which can scorch the leaves.',
            soil: 'Well-draining potting mix with peat moss and perlite.',
            temperature: 'Prefers temperatures between 65-85°F (18-29°C) with high humidity.',
            additionalTips: 'Wipe leaves occasionally to remove dust and improve photosynthesis.'
          })
        }
      };

      // Set up the mock to return our mock response
      const mockGenerateContent = require('@google/generative-ai').GoogleGenerativeAI().getGenerativeModel().generateContent;
      mockGenerateContent.mockResolvedValue(mockResponse);

      // Call the function
      const result = await getPlantCareRecommendations('Monstera Deliciosa', 'Monstera deliciosa');
      
      expect(result).toEqual({
        watering: 'Water once a week, allowing soil to dry out between waterings.',
        light: 'Bright, indirect light. Avoid direct sunlight which can scorch the leaves.',
        soil: 'Well-draining potting mix with peat moss and perlite.',
        temperature: 'Prefers temperatures between 65-85°F (18-29°C) with high humidity.',
        additionalTips: 'Wipe leaves occasionally to remove dust and improve photosynthesis.'
      });

      // Verify the mock was called with the correct model name
      const mockGetGenerativeModel = require('@google/generative-ai').GoogleGenerativeAI().getGenerativeModel;
      expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash-8b' });
      expect(mockGenerateContent).toHaveBeenCalled();
    });

    it('should handle errors and return fallback data', async () => {
      // Mock the API to throw an error
      const mockGenerateContent = require('@google/generative-ai').GoogleGenerativeAI().getGenerativeModel().generateContent;
      mockGenerateContent.mockRejectedValue(new Error('API error'));

      // Call the function
      const result = await getPlantCareRecommendations('Monstera Deliciosa', 'Monstera deliciosa');
      
      // Verify fallback data is returned
      expect(result).toEqual({
        watering: 'Water when the top inch of soil feels dry.',
        light: 'Provide bright, indirect light.',
        soil: 'Use well-draining potting mix.',
        temperature: 'Keep in normal room temperature (65-75°F/18-24°C).',
        additionalTips: 'Research specific care requirements for this plant species.'
      });
    });
  });
}); 