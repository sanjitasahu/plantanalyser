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

// Helper function to convert WebP image to JPEG format
const convertWebPToJPEG = async (base64Data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Extract the base64 data without the prefix
      const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return resolve(base64Data); // Return original if not in expected format
      }
      
      const mimeType = matches[1];
      // If not WebP, return the original
      if (!mimeType.includes('webp')) {
        return resolve(base64Data);
      }
      
      // Create an image element to load the WebP
      const img = new Image();
      img.onload = () => {
        // Create a canvas to draw the image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image on the canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to get canvas context'));
        }
        
        ctx.drawImage(img, 0, 0);
        
        // Convert to JPEG format
        const jpegBase64 = canvas.toDataURL('image/jpeg', 0.9);
        resolve(jpegBase64);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for conversion'));
      };
      
      // Set the source to the WebP image
      img.src = base64Data;
    } catch (error) {
      console.error('Error converting WebP to JPEG:', error);
      resolve(base64Data); // Return original on error
    }
  });
};

// Helper function to convert base64 image data to a Part object for the Gemini API
const base64ToImagePart = (base64Data: string): Part => {
  try {
    // Check if the data is a data URL
    if (base64Data.startsWith('data:')) {
      // Extract the MIME type and base64 data
      const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      
      if (!matches || matches.length !== 3) {
        throw new Error('Invalid data URL format');
      }
      
      const mimeType = matches[1];
      const base64 = matches[2];
      
      // Ensure the base64 string is valid
      // Remove any whitespace or line breaks that might be present
      const cleanBase64 = base64.replace(/\s/g, '');
      
      return {
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType.includes('webp') ? 'image/jpeg' : mimeType
        }
      };
    } else {
      // If it's already a raw base64 string without the data URL prefix
      return {
        inlineData: {
          data: base64Data.replace(/\s/g, ''),
          mimeType: 'image/jpeg' // Default to JPEG if no MIME type is provided
        }
      };
    }
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image data. Please try a different image format (JPEG or PNG recommended).');
  }
};

// Helper function to resize large images to reduce file size
const resizeImageIfNeeded = async (base64Data: string, maxWidth = 1024, maxHeight = 1024): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Check if the data is a data URL
      if (!base64Data.startsWith('data:')) {
        return resolve(base64Data);
      }
      
      // Create an image element to load the image
      const img = new Image();
      img.onload = () => {
        // If the image is already small enough, return the original
        if (img.width <= maxWidth && img.height <= maxHeight) {
          return resolve(base64Data);
        }
        
        // Calculate new dimensions while maintaining aspect ratio
        let newWidth = img.width;
        let newHeight = img.height;
        
        if (newWidth > maxWidth) {
          newHeight = (newHeight * maxWidth) / newWidth;
          newWidth = maxWidth;
        }
        
        if (newHeight > maxHeight) {
          newWidth = (newWidth * maxHeight) / newHeight;
          newHeight = maxHeight;
        }
        
        // Create a canvas to draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw the image on the canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to get canvas context'));
        }
        
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Get the MIME type from the original data URL
        const mimeTypeMatch = base64Data.match(/^data:([^;]+);/);
        const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
        
        // Convert to the same format but resized
        const resizedBase64 = canvas.toDataURL(mimeType, 0.9);
        resolve(resizedBase64);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for resizing'));
      };
      
      // Set the source to the image
      img.src = base64Data;
    } catch (error) {
      console.error('Error resizing image:', error);
      resolve(base64Data); // Return original on error
    }
  });
};

// Helper function to handle API errors with specific messages for quota limits
const handleApiError = (error: any): string => {
  console.error('API Error:', error);
  
  // Check for quota exceeded errors
  if (error.message && (
    error.message.includes('quota') || 
    error.message.includes('limit') || 
    error.message.includes('exceeded') ||
    error.message.includes('RESOURCE_EXHAUSTED')
  )) {
    return 'API quota exceeded. Please try again later or contact support for assistance.';
  }
  
  // Generic error message for other errors
  return 'An error occurred while processing your request. Please try again.';
};

// Helper function to ensure values are strings
const ensureString = (value: any, defaultValue: string = ''): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (value === null || value === undefined) {
    return defaultValue;
  }
  try {
    // Try to convert objects or arrays to JSON strings
    return JSON.stringify(value);
  } catch (e) {
    return defaultValue;
  }
};

/**
 * Identify a plant from an image using the Gemini API
 * @param imageBase64 Base64-encoded image data
 * @returns Plant identification information
 */
export const identifyPlant = async (imageBase64: string): Promise<PlantIdentification> => {
  try {
    // Resize large images to reduce file size
    const resizedImageBase64 = await resizeImageIfNeeded(imageBase64);
    
    // Convert WebP to JPEG if needed
    const processedImageBase64 = await convertWebPToJPEG(resizedImageBase64);
    
    // Convert base64 image to a Part object
    const imagePart = base64ToImagePart(processedImageBase64);
    
    // Create prompt for plant identification with more detailed instructions
    const prompt = `
      You are a professional botanist with expertise in plant identification. 
      Analyze this plant image carefully and provide detailed identification information.
      
      Pay special attention to:
      - Leaf shape, arrangement, and venation
      - Stem structure and color
      - Any visible flowers or fruits
      - Overall growth habit and form
      
      Be particularly careful to distinguish between:
      - Coffee plants (Coffea species) and Dracaena species
      - Common houseplants that may look similar
      - Young plants that may not have developed distinctive features yet
      
      If you're uncertain about the exact species, indicate this in your confidence level.
      
      Respond with a JSON object that includes:
      {
        "name": "Common name of the plant",
        "scientificName": "Scientific name (genus and species)",
        "confidence": A number between 0-100 representing your confidence level,
        "description": "A detailed description of the plant, including its characteristics and origin",
        "tags": ["Array", "of", "relevant", "tags", "like", "indoor", "flowering", "succulent", "etc"]
      }
      Only respond with the JSON object, nothing else.
    `;
    
    try {
      // First try with the pro model
      const proModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await proModel.generateContent([prompt, imagePart]);
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
    } catch (proModelError: any) {
      console.warn('Pro model failed, falling back to flash model:', proModelError);
      
      // Check if this is a quota exceeded error
      if (proModelError.message && (
        proModelError.message.includes('quota') || 
        proModelError.message.includes('limit') || 
        proModelError.message.includes('exceeded') ||
        proModelError.message.includes('RESOURCE_EXHAUSTED')
      )) {
        throw new Error('API quota exceeded. Please try again later or contact support for assistance.');
      }
      
      // Fallback to flash model if pro model fails
      const flashModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await flashModel.generateContent([prompt, imagePart]);
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
    }
  } catch (error: any) {
    console.error('Error identifying plant:', error);
    
    // Check for quota exceeded errors
    if (error.message && (
      error.message.includes('quota') || 
      error.message.includes('limit') || 
      error.message.includes('exceeded') ||
      error.message.includes('RESOURCE_EXHAUSTED')
    )) {
      return {
        name: 'API Quota Exceeded',
        scientificName: 'Service Temporarily Unavailable',
        confidence: 0,
        description: 'The API quota has been exceeded. Please try again later or contact support for assistance.',
        tags: ['error', 'quota'],
      };
    }
    
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
 * Assess the health of a plant from an image using the Gemini API
 * @param imageBase64 Base64-encoded image data
 * @returns Plant health assessment information
 */
export const assessPlantHealth = async (imageBase64: string): Promise<PlantHealth> => {
  try {
    // Resize large images to reduce file size
    const resizedImageBase64 = await resizeImageIfNeeded(imageBase64);
    
    // Convert WebP to JPEG if needed
    const processedImageBase64 = await convertWebPToJPEG(resizedImageBase64);
    
    // Convert base64 image to a Part object
    const imagePart = base64ToImagePart(processedImageBase64);
    
    // Create prompt for plant health assessment
    const prompt = `
      You are a plant pathologist and expert gardener specializing in diagnosing plant health issues.
      Analyze this plant image carefully and provide a detailed health assessment.
      
      Pay special attention to:
      - Leaf discoloration, spots, or abnormal patterns
      - Signs of pests or pest damage
      - Stem and branch condition
      - Overall plant vigor and appearance
      - Signs of nutrient deficiencies or excesses
      
      Respond with a JSON object that includes:
      {
        "status": One of: "Healthy", "Needs attention", or "Unhealthy",
        "summary": "A concise summary of the plant's overall health condition",
        "issues": [
          {
            "name": "Name of the issue (e.g., 'Leaf Spot Disease', 'Spider Mite Infestation')",
            "description": "Detailed description of the issue",
            "severity": One of: "low", "medium", or "high",
            "solution": "Recommended treatment or solution"
          }
        ]
      }
      
      If the plant appears completely healthy, return an empty array for issues.
      Only respond with the JSON object, nothing else.
    `;
    
    try {
      // First try with the pro model
      const proModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await proModel.generateContent([prompt, imagePart]);
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
        summary: jsonResponse.summary || 'Unable to determine plant health status with certainty.',
        issues: jsonResponse.issues || [],
      };
    } catch (proModelError: any) {
      console.warn('Pro model failed, falling back to flash model:', proModelError);
      
      // Check if this is a quota exceeded error
      if (proModelError.message && (
        proModelError.message.includes('quota') || 
        proModelError.message.includes('limit') || 
        proModelError.message.includes('exceeded') ||
        proModelError.message.includes('RESOURCE_EXHAUSTED')
      )) {
        throw new Error('API quota exceeded. Please try again later or contact support for assistance.');
      }
      
      // Fallback to flash model if pro model fails
      const flashModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await flashModel.generateContent([prompt, imagePart]);
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
        summary: jsonResponse.summary || 'Unable to determine plant health status with certainty.',
        issues: jsonResponse.issues || [],
      };
    }
  } catch (error: any) {
    console.error('Error assessing plant health:', error);
    
    // Check for quota exceeded errors
    if (error.message && (
      error.message.includes('quota') || 
      error.message.includes('limit') || 
      error.message.includes('exceeded') ||
      error.message.includes('RESOURCE_EXHAUSTED')
    )) {
      return {
        status: 'Needs attention',
        summary: 'API Quota Exceeded: The service is temporarily unavailable. Please try again later or contact support for assistance.',
        issues: [{
          name: 'Service Limitation',
          description: 'The API quota has been exceeded. This is a temporary issue.',
          severity: 'medium',
          solution: 'Please try again later when the quota resets or contact support for assistance.'
        }],
      };
    }
    
    // Return fallback data in case of error
    return {
      status: 'Needs attention',
      summary: 'Unable to assess plant health due to an error. Please try again with a clearer image.',
      issues: [{
        name: 'Analysis Error',
        description: 'There was a problem analyzing this image.',
        severity: 'medium',
        solution: 'Try again with a clearer, well-lit image that shows the entire plant or the affected areas clearly.'
      }],
    };
  }
};

/**
 * Get care recommendations for a plant based on its name and scientific name
 * @param plantName Common name of the plant
 * @param scientificName Scientific name of the plant
 * @returns Plant care recommendations
 */
export const getPlantCareRecommendations = async (
  plantName: string,
  scientificName: string
): Promise<PlantCare> => {
  try {
    // Create prompt for plant care recommendations
    const prompt = `
      You are a professional horticulturist with extensive knowledge of plant care requirements.
      Provide detailed care recommendations for the following plant:
      
      Common Name: ${plantName}
      Scientific Name: ${scientificName}
      
      Include specific information about:
      
      Respond with a JSON object that includes:
      {
        "watering": "Detailed watering instructions including frequency and amount",
        "light": "Light requirements (e.g., full sun, partial shade, etc.)",
        "soil": "Soil type and pH preferences",
        "temperature": "Ideal temperature range and tolerance",
        "humidity": "Humidity requirements or preferences",
        "additionalTips": "Any other important care information",
        "summary": "A concise summary of the most important care requirements",
        "homeRemedies": "Natural and DIY solutions to promote healthy growth of the plant",
        "culturalSignificance": "Information about the plant's importance in ancient Hindu and Chinese traditions, including recommended placement directions according to Vastu/Feng Shui principles"
      }
      
      Only respond with the JSON object, nothing else.
    `;
    
    try {
      // First try with the pro model
      const proModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await proModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from Gemini API');
      }
      
      const jsonResponse = JSON.parse(jsonMatch[0]) as GeminiCareResponse;
      
      return {
        watering: ensureString(jsonResponse.watering, 'Water when the top inch of soil feels dry.'),
        light: ensureString(jsonResponse.light, 'Moderate to bright indirect light.'),
        soil: ensureString(jsonResponse.soil, 'Well-draining potting mix.'),
        temperature: ensureString(jsonResponse.temperature, '65-80°F (18-27°C)'),
        humidity: ensureString(jsonResponse.humidity, 'Moderate humidity is suitable for many plants.'),
        additionalTips: ensureString(jsonResponse.additionalTips, 'Research specific care requirements for this plant species.'),
        summary: ensureString(jsonResponse.summary, 'Provide moderate water, bright indirect light, and well-draining soil.'),
        homeRemedies: ensureString(jsonResponse.homeRemedies, 'No specific home remedies information available.'),
        culturalSignificance: ensureString(jsonResponse.culturalSignificance, 'No specific cultural significance information available.')
      };
    } catch (proModelError: any) {
      console.warn('Pro model failed, falling back to flash model:', proModelError);
      
      // Check if this is a quota exceeded error
      if (proModelError.message && (
        proModelError.message.includes('quota') || 
        proModelError.message.includes('limit') || 
        proModelError.message.includes('exceeded') ||
        proModelError.message.includes('RESOURCE_EXHAUSTED')
      )) {
        throw new Error('API quota exceeded. Please try again later or contact support for assistance.');
      }
      
      // Fallback to flash model if pro model fails
      const flashModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await flashModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from Gemini API');
      }
      
      const jsonResponse = JSON.parse(jsonMatch[0]) as GeminiCareResponse;
      
      return {
        watering: ensureString(jsonResponse.watering, 'Water when the top inch of soil feels dry.'),
        light: ensureString(jsonResponse.light, 'Moderate to bright indirect light.'),
        soil: ensureString(jsonResponse.soil, 'Well-draining potting mix.'),
        temperature: ensureString(jsonResponse.temperature, '65-80°F (18-27°C)'),
        humidity: ensureString(jsonResponse.humidity, 'Moderate humidity is suitable for many plants.'),
        additionalTips: ensureString(jsonResponse.additionalTips, 'Research specific care requirements for this plant species.'),
        summary: ensureString(jsonResponse.summary, 'Provide moderate water, bright indirect light, and well-draining soil.'),
        homeRemedies: ensureString(jsonResponse.homeRemedies, 'No specific home remedies information available.'),
        culturalSignificance: ensureString(jsonResponse.culturalSignificance, 'No specific cultural significance information available.')
      };
    }
  } catch (error: any) {
    console.error('Error getting plant care recommendations:', error);
    
    // Check for quota exceeded errors
    if (error.message && (
      error.message.includes('quota') || 
      error.message.includes('limit') || 
      error.message.includes('exceeded') ||
      error.message.includes('RESOURCE_EXHAUSTED')
    )) {
      return {
        watering: 'API Quota Exceeded: Service temporarily unavailable.',
        light: 'Please try again later.',
        soil: 'Well-draining potting mix is generally recommended for most plants.',
        temperature: '65-80°F (18-27°C) is suitable for many houseplants.',
        additionalTips: 'The API quota has been exceeded. This is a temporary issue.',
        summary: 'API Quota Exceeded: The service is temporarily unavailable. Please try again later or contact support for assistance.',
        humidity: 'Moderate humidity is suitable for many plants.',
        homeRemedies: 'Unable to provide specific home remedies due to service limitations.',
        culturalSignificance: 'Unable to provide cultural significance information due to service limitations.'
      };
    }
    
    // Return fallback data in case of error
    return {
      watering: 'Water when the top inch of soil feels dry.',
      light: 'Moderate to bright indirect light.',
      soil: 'Well-draining potting mix.',
      temperature: '65-80°F (18-27°C)',
      additionalTips: 'Research specific care requirements for this plant species.',
      summary: 'Unable to retrieve specific care information. Provide moderate water, bright indirect light, and well-draining soil as a general guideline.',
      humidity: 'Moderate humidity is suitable for many plants.',
      homeRemedies: 'Common home remedies include using diluted neem oil for pest control and coffee grounds as natural fertilizer.',
      culturalSignificance: 'Plants have been valued in many cultures for their aesthetic, medicinal, and spiritual properties.'
    };
  }
}; 