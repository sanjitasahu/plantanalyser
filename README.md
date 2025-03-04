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
- Google Gemini API key

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