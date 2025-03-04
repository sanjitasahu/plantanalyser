import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from '@google/generative-ai';
import { 
  PlantIdentification, 
  PlantHealth, 
  PlantCare,
  GeminiIdentificationResponse,
  GeminiHealthResponse,
  GeminiCareResponse
} from '../types';

// Initialize the Gemini API with the API key from environment variables
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('Gemini API key is missing. Please add it to your .env file.');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

// Configure safety settings to block harmful content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Helper function to convert base64 image data to a Part object for the Gemini API
const base64ToImagePart = (base64Data: string): Part => {
  // Remove data URL prefix if present
  const base64WithoutPrefix = base64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  
  return {
    inlineData: {
      data: base64WithoutPrefix,
      mimeType: 'image/jpeg'
    }
  };
};

/**
 * Identify a plant from an image using the Gemini API
 * @param imageBase64 Base64-encoded image data
 * @returns Plant identification information
 */
export const identifyPlant = async (imageBase64: string): Promise<PlantIdentification> => {
  try {
    // Convert base64 image to a Part object
    const imagePart = base64ToImagePart(imageBase64);
    
    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });
    
    // Create prompt for plant identification
    const prompt = `
      Analyze this plant image and provide detailed identification information.
      Respond with a JSON object that includes:
      {
        "name": "Common name of the plant",
        "scientificName": "Scientific name (genus and species)",
        "confidence": A number between 0-100 representing your confidence level,
        "description": "A brief description of the plant, including its characteristics and origin",
        "tags": ["Array", "of", "relevant", "tags", "like", "indoor", "flowering", "succulent", "etc"]
      }
      Only respond with the JSON object, nothing else.
    `;
    
    // Generate content with the image
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON response from Gemini API');
    }
    
    const jsonResponse = JSON.parse(jsonMatch[0]) as GeminiIdentificationResponse;
    
    return {
      name: jsonResponse.name || 'Unknown Plant',
      scientificName: jsonResponse.scientificName || 'Species unknown',
      confidence: jsonResponse.confidence || 0,
      description: jsonResponse.description || 'No description available',
      tags: jsonResponse.tags || [],
    };
  } catch (error) {
    console.error('Error identifying plant:', error);
    
    // Return fallback data in case of error
    return {
      name: 'Identification Failed',
      scientificName: 'Error processing image',
      confidence: 0,
      description: 'There was an error analyzing this image. Please try again with a clearer image of the plant.',
      tags: ['error'],
    };
  }
};

/**
 * Assess plant health from an image using the Gemini API
 * @param imageBase64 Base64-encoded image data
 * @returns Plant health assessment
 */
export const assessPlantHealth = async (imageBase64: string): Promise<PlantHealth> => {
  try {
    // Convert base64 image to a Part object
    const imagePart = base64ToImagePart(imageBase64);
    
    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });
    
    // Create prompt for plant health assessment
    const prompt = `
      Analyze this plant image and provide a detailed health assessment.
      Respond with a JSON object that includes:
      {
        "status": One of ["Healthy", "Needs attention", "Unhealthy"],
        "summary": "A brief summary of the plant's overall health condition",
        "issues": [
          {
            "name": "Name of the issue (e.g., 'Leaf yellowing')",
            "description": "Detailed description of the issue",
            "severity": One of ["low", "medium", "high"],
            "solution": "Recommended solution to address this issue"
          }
        ]
      }
      If the plant appears healthy with no issues, return an empty array for issues.
      Only respond with the JSON object, nothing else.
    `;
    
    // Generate content with the image
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON response from Gemini API');
    }
    
    const jsonResponse = JSON.parse(jsonMatch[0]) as GeminiHealthResponse;
    
    return {
      status: jsonResponse.status || 'Needs attention',
      summary: jsonResponse.summary || 'Unable to determine plant health status',
      issues: jsonResponse.issues || [],
    };
  } catch (error) {
    console.error('Error assessing plant health:', error);
    
    // Return fallback data in case of error
    return {
      status: 'Needs attention',
      summary: 'There was an error analyzing this image. Please try again with a clearer image of the plant.',
      issues: [
        {
          name: 'Analysis Error',
          description: 'The system encountered an error while analyzing this plant.',
          severity: 'medium',
          solution: 'Try taking a clearer photo with good lighting, focusing on the plant\'s leaves and stems.',
        },
      ],
    };
  }
};

/**
 * Get care recommendations for a plant using the Gemini API
 * @param plantName Common name of the plant
 * @param scientificName Scientific name of the plant (optional)
 * @returns Plant care recommendations
 */
export const getPlantCareRecommendations = async (
  plantName: string,
  scientificName?: string
): Promise<PlantCare> => {
  try {
    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });
    
    // Create prompt for plant care recommendations
    const prompt = `
      Provide detailed care recommendations for ${plantName}${scientificName ? ` (${scientificName})` : ''}.
      Respond with a JSON object that includes:
      {
        "watering": "Detailed watering instructions, including frequency and amount",
        "light": "Light requirements and placement recommendations",
        "soil": "Soil type and composition recommendations",
        "temperature": "Ideal temperature range and humidity conditions",
        "additionalTips": "Any additional care tips or special considerations"
      }
      Only respond with the JSON object, nothing else.
    `;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON response from Gemini API');
    }
    
    const jsonResponse = JSON.parse(jsonMatch[0]) as GeminiCareResponse;
    
    return {
      watering: jsonResponse.watering || 'Water when the top inch of soil feels dry.',
      light: jsonResponse.light || 'Provide bright, indirect light.',
      soil: jsonResponse.soil || 'Use well-draining potting mix.',
      temperature: jsonResponse.temperature || 'Keep in normal room temperature (65-75°F/18-24°C).',
      additionalTips: jsonResponse.additionalTips,
    };
  } catch (error) {
    console.error('Error getting plant care recommendations:', error);
    
    // Return fallback data in case of error
    return {
      watering: 'Water when the top inch of soil feels dry.',
      light: 'Provide bright, indirect light.',
      soil: 'Use well-draining potting mix.',
      temperature: 'Keep in normal room temperature (65-75°F/18-24°C).',
      additionalTips: 'Research specific care requirements for this plant species.',
    };
  }
}; 