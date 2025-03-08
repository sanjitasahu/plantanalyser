# PlantAnalyser Backend API

This directory contains the Firebase Functions backend for the PlantAnalyser application.

## API Endpoints

### Plants API
- `GET /api/plants` - Get all plants
- `GET /api/plants/:id` - Get a specific plant
- `POST /api/plants` - Create a new plant
- `PUT /api/plants/:id` - Update a plant
- `DELETE /api/plants/:id` - Delete a plant

### Analysis API
- `GET /api/analysis` - Get all analyses
- `GET /api/analysis/:id` - Get a specific analysis
- `GET /api/analysis/plant/:plantId` - Get all analyses for a specific plant
- `POST /api/analysis` - Create a new analysis
- `DELETE /api/analysis/:id` - Delete an analysis

## Development

1. Install dependencies:
```
cd functions
npm install
```

2. Run locally:
```
firebase emulators:start
```

## Deployment

The backend is automatically deployed when changes are pushed to the main branch on GitHub. 