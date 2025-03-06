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
    } catch (proModelError) {
      console.warn('Pro model failed, falling back to flash model:', proModelError);
      
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
    // Resize large images to reduce file size
    const resizedImageBase64 = await resizeImageIfNeeded(imageBase64);
    
    // Convert WebP to JPEG if needed
    const processedImageBase64 = await convertWebPToJPEG(resizedImageBase64);
    
    // Convert base64 image to a Part object
    const imagePart = base64ToImagePart(processedImageBase64);
    
    // Create prompt for plant health assessment with more detailed instructions
    const prompt = `
      You are a plant pathologist and horticultural expert. 
      Analyze this plant image carefully and provide a detailed health assessment.
      
      Pay special attention to:
      - Leaf color, spots, or discoloration
      - Signs of pests or pest damage
      - Growth patterns and overall vigor
      - Stem and branch condition
      - Soil condition (if visible)
      
      Respond with a JSON object that includes:
      {
        "status": One of ["Healthy", "Needs attention", "Unhealthy"],
        "summary": "A detailed summary of the plant's overall health condition",
        "issues": [
          {
            "name": "Name of the issue (e.g., 'Leaf yellowing')",
            "description": "Detailed description of the issue, including possible causes",
            "severity": One of ["low", "medium", "high"],
            "solution": "Specific recommended solution to address this issue"
          }
        ]
      }
      If the plant appears healthy with no issues, return an empty array for issues.
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
        summary: jsonResponse.summary || 'Unable to determine plant health status',
        issues: jsonResponse.issues || [],
      };
    } catch (proModelError) {
      console.warn('Pro model failed, falling back to flash model:', proModelError);
      
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
        summary: jsonResponse.summary || 'Unable to determine plant health status',
        issues: jsonResponse.issues || [],
      };
    }
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
  scientificName: string
): Promise<PlantCare> => {
  try {
    // Create prompt for plant care recommendations with more detailed instructions
    const prompt = `
      You are a professional horticulturist with expertise in plant care and cultural knowledge.
      Provide detailed and specific care recommendations for ${plantName}${scientificName ? ` (${scientificName})` : ''}.
      
      Include information about:
      - Specific watering needs (frequency, amount, seasonal adjustments)
      - Precise light requirements (intensity, duration, placement)
      - Soil composition and drainage requirements
      - Temperature range and humidity preferences
      - Fertilization schedule and type
      - Common issues to watch for and how to prevent them
      - Pruning and maintenance tips
      - Home remedies for healthy growth
      - Cultural significance in ancient Hindu and Chinese traditions
      - Recommended placement direction according to Vastu/Feng Shui principles
      
      Respond with a JSON object that includes:
      {
        "watering": "Detailed watering instructions, including frequency and amount",
        "light": "Light requirements and placement recommendations",
        "soil": "Soil type and composition recommendations",
        "temperature": "Ideal temperature range and humidity conditions",
        "additionalTips": "Any additional care tips or special considerations",
        "summary": "A comprehensive summary of the care guide",
        "humidity": "Recommended humidity levels and how to maintain them",
        "homeRemedies": "Natural home remedies to promote healthy growth of the plant",
        "culturalSignificance": "Cultural significance in ancient Hindu and Chinese traditions, including recommended placement direction according to Vastu/Feng Shui principles"
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
        watering: jsonResponse.watering || 'Water when the top inch of soil feels dry.',
        light: jsonResponse.light || 'Provide bright, indirect light.',
        soil: jsonResponse.soil || 'Use well-draining potting mix.',
        temperature: jsonResponse.temperature || 'Keep in normal room temperature (65-75°F/18-24°C).',
        additionalTips: jsonResponse.additionalTips,
        summary: jsonResponse.summary || `Care guide for ${plantName}. Water appropriately, provide adequate light, and monitor regularly.`,
        humidity: jsonResponse.humidity || 'Average humidity levels recommended',
        homeRemedies: jsonResponse.homeRemedies || 'No specific home remedies information available.',
        culturalSignificance: jsonResponse.culturalSignificance || 'No specific cultural significance information available.'
      };
    } catch (proModelError) {
      console.warn('Pro model failed, falling back to flash model:', proModelError);
      
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
        watering: jsonResponse.watering || 'Water when the top inch of soil feels dry.',
        light: jsonResponse.light || 'Provide bright, indirect light.',
        soil: jsonResponse.soil || 'Use well-draining potting mix.',
        temperature: jsonResponse.temperature || 'Keep in normal room temperature (65-75°F/18-24°C).',
        additionalTips: jsonResponse.additionalTips,
        summary: jsonResponse.summary || `Care guide for ${plantName}. Water appropriately, provide adequate light, and monitor regularly.`,
        humidity: jsonResponse.humidity || 'Average humidity levels recommended',
        homeRemedies: jsonResponse.homeRemedies || 'No specific home remedies information available.',
        culturalSignificance: jsonResponse.culturalSignificance || 'No specific cultural significance information available.'
      };
    }
  } catch (error) {
    console.error('Error getting plant care recommendations:', error);
    
    // Return fallback data in case of error
    return {
      watering: 'Water when the top inch of soil feels dry.',
      light: 'Provide bright, indirect light.',
      soil: 'Use well-draining potting mix.',
      temperature: 'Keep in normal room temperature (65-75°F/18-24°C).',
      additionalTips: 'Regularly check for pests and diseases.',
      summary: `Care guide for ${plantName}. Water appropriately, provide adequate light, and monitor regularly.`,
      humidity: 'Average humidity levels recommended',
      homeRemedies: 'No specific home remedies information available.',
      culturalSignificance: 'No specific cultural significance information available.'
    };
  }
}; 