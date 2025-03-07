const express = require('express');
const admin = require('firebase-admin');
const axios = require('axios');
const router = express.Router();

// Firestore reference
const db = admin.firestore();
const analysisCollection = db.collection('analyses');

/**
 * @route   GET /api/analysis
 * @desc    Get all analyses
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const snapshot = await analysisCollection.get();
    const analyses = [];
    
    snapshot.forEach(doc => {
      analyses.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json({
      status: 'success',
      count: analyses.length,
      data: analyses
    });
  } catch (error) {
    console.error('Error getting analyses:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve analyses',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/analysis/:id
 * @desc    Get an analysis by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const analysisId = req.params.id;
    const analysisDoc = await analysisCollection.doc(analysisId).get();
    
    if (!analysisDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: `Analysis with ID ${analysisId} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        id: analysisDoc.id,
        ...analysisDoc.data()
      }
    });
  } catch (error) {
    console.error(`Error getting analysis ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve analysis',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/analysis/plant/:plantId
 * @desc    Get all analyses for a specific plant
 * @access  Public
 */
router.get('/plant/:plantId', async (req, res) => {
  try {
    const plantId = req.params.plantId;
    const snapshot = await analysisCollection.where('plantId', '==', plantId).get();
    
    const analyses = [];
    snapshot.forEach(doc => {
      analyses.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json({
      status: 'success',
      count: analyses.length,
      data: analyses
    });
  } catch (error) {
    console.error(`Error getting analyses for plant ${req.params.plantId}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve plant analyses',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/analysis
 * @desc    Create a new analysis
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    // Validate request
    if (!req.body.imageUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'Image URL is required'
      });
    }
    
    const analysisData = {
      plantId: req.body.plantId || '',
      imageUrl: req.body.imageUrl,
      date: req.body.date || new Date().toISOString(),
      identification: req.body.identification || {},
      health: req.body.health || {},
      care: req.body.care || {},
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const newAnalysisRef = await analysisCollection.add(analysisData);
    
    res.status(201).json({
      status: 'success',
      message: 'Analysis created successfully',
      data: {
        id: newAnalysisRef.id,
        ...analysisData
      }
    });
  } catch (error) {
    console.error('Error creating analysis:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create analysis',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/analysis/:id
 * @desc    Delete an analysis
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const analysisId = req.params.id;
    const analysisDoc = await analysisCollection.doc(analysisId).get();
    
    if (!analysisDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: `Analysis with ID ${analysisId} not found`
      });
    }
    
    await analysisCollection.doc(analysisId).delete();
    
    res.status(200).json({
      status: 'success',
      message: 'Analysis deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting analysis ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete analysis',
      error: error.message
    });
  }
});

module.exports = router; 