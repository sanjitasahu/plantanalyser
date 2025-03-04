// Simple test script to verify Gemini API integration
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the API with the correct environment variable name
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Test function to identify a plant
async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API connection...');
    console.log('API Key available:', process.env.REACT_APP_GEMINI_API_KEY ? 'Yes' : 'No');
    
    // Use a text-only model for a simple test
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    // Simple prompt to test the API
    const prompt = 'What are the best practices for caring for a Monstera Deliciosa plant?';
    
    console.log(`Sending prompt: "${prompt}"`);
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('\nAPI Response:');
    console.log('=============');
    console.log(text);
    console.log('\nAPI test completed successfully!');
    
  } catch (error) {
    console.error('Error testing Gemini API:', error);
  }
}

// Run the test
testGeminiAPI(); 