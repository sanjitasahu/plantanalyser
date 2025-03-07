# PlantAnalyser

A mobile-friendly application for plant identification, health diagnosis, and care recommendations using Google's Gemini Vision AI.

## Features

- Plant identification using camera or gallery images
- Plant health assessment
- Care recommendations
- My Garden collection to track your plants
- Expert chat powered by Gemini AI
- Home remedies and cultural significance information

## Technologies

- React
- TypeScript
- Material UI
- Google Gemini API
- Firebase (Hosting & Functions)

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your Gemini API key:
   ```
   REACT_APP_GEMINI_API_KEY=your_api_key_here
   ```
4. Install Firebase CLI and login:
   ```
   npm install -g firebase-tools
   firebase login
   ```
5. Start the development server:
   ```
   npm start
   ```

## Backend API

The application uses Firebase Functions for the backend API. See the [functions README](./functions/README.md) for details on available endpoints.

## Deployment

The application is deployed on Firebase:
- Frontend: https://plantanalyser-99e62.web.app
- Backend API: https://plantanalyser-99e62.web.app/api/

## License

MIT 