const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Initialize environment variables
dotenv.config();

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - Health check
app.get('/', (req, res) => {
  res.status(200).send({ 
    status: 'success',
    message: 'PlantAnalyzer API is running',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/plants', require('./routes/plants'));
app.use('/api/analysis', require('./routes/analysis'));

// Not Found handler
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send({
    status: 'error',
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Export the Express API as a Firebase Function
exports.api = functions.https.onRequest(app); 