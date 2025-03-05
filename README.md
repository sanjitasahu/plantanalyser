# Plant Analyzer

A React application that uses Google's Gemini AI to identify plants, assess their health, and provide care recommendations.

## Features

- **Plant Identification**: Upload a photo of a plant to identify its species
- **Health Assessment**: Check if your plant is healthy or needs attention
- **Care Recommendations**: Get detailed care instructions for your plants
- **User Authentication**: Secure login and registration system
- **Plant Management**: Save and track your plants over time

## Technologies Used

- React with TypeScript
- Material UI for the user interface
- Google Gemini API for AI-powered plant analysis
- Jest for testing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key (get one at [https://ai.google.dev/](https://ai.google.dev/))

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/plant-analyzer.git
   cd plant-analyzer
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your Gemini API key
   ```
   REACT_APP_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser

## Gemini API Setup

This application uses Google's Gemini API for plant identification, health assessment, and care recommendations. To use these features, you need to:

1. Get a Gemini API key from [https://ai.google.dev/](https://ai.google.dev/)
2. Add your API key to the `.env` file as shown in the installation instructions
3. Make sure your API key has access to the following models:
   - `gemini-1.5-pro` (used for more accurate plant identification)
   - `gemini-1.5-flash` (used as a fallback)

### Image Requirements

For best results with plant identification and health assessment:

- **Supported formats**: JPEG, PNG (WebP is automatically converted to JPEG)
- **Maximum file size**: 10MB (larger images are automatically resized)
- **Image quality**: Clear, well-lit photos work best
- **Plant visibility**: Make sure the plant's distinctive features (leaves, stems, flowers) are clearly visible
- **Multiple angles**: For difficult-to-identify plants, try uploading photos from different angles

### Troubleshooting Gemini API Issues

If you're experiencing issues with plant identification:

- **Misidentification**: The application now uses the more capable `gemini-1.5-pro` model for better accuracy. If plants are still being misidentified, try:
  - Taking clearer photos with good lighting
  - Including multiple angles of the plant
  - Making sure the plant's distinctive features (leaves, stems, flowers) are clearly visible
  - Using JPEG or PNG format instead of WebP
  - Updating to the latest version of the application

- **API Key Issues**: If you see errors related to the API key:
  - Verify your API key is correctly set in the `.env` file
  - Check that your API key has the necessary permissions and quota
  - Ensure your API key is active and not expired

- **Image Processing Errors**: If you see errors related to image processing:
  - Try using a different image format (JPEG or PNG recommended)
  - Reduce the image size if it's very large
  - Ensure the image is not corrupted
  - Try a different image of the plant

## Testing

Run the test suite with:
```
npm test
```

For test coverage:
```
npm run test:coverage
```

## Demo

The application includes a demo page at `/gemini-demo` that allows you to test the Gemini API integration without needing to create an account.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google for providing the Gemini API
- The React and Material UI teams for their excellent libraries 