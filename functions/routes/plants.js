const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Firestore reference
const db = admin.firestore();
const plantsCollection = db.collection('plants');

/**
 * @route   GET /api/plants
 * @desc    Get all plants
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const snapshot = await plantsCollection.get();
    const plants = [];
    
    snapshot.forEach(doc => {
      plants.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json({
      status: 'success',
      count: plants.length,
      data: plants
    });
  } catch (error) {
    console.error('Error getting plants:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve plants',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/plants/:id
 * @desc    Get a plant by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const plantId = req.params.id;
    const plantDoc = await plantsCollection.doc(plantId).get();
    
    if (!plantDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: `Plant with ID ${plantId} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        id: plantDoc.id,
        ...plantDoc.data()
      }
    });
  } catch (error) {
    console.error(`Error getting plant ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve plant',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/plants
 * @desc    Create a new plant
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    // Validate request
    if (!req.body.name) {
      return res.status(400).json({
        status: 'error',
        message: 'Plant name is required'
      });
    }
    
    const plantData = {
      name: req.body.name,
      species: req.body.species || '',
      images: req.body.images || [],
      lastWatered: req.body.lastWatered || null,
      healthStatus: req.body.healthStatus || 'Unknown',
      notes: req.body.notes || '',
      wateringFrequency: req.body.wateringFrequency || '',
      sunlightNeeds: req.body.sunlightNeeds || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const newPlantRef = await plantsCollection.add(plantData);
    
    res.status(201).json({
      status: 'success',
      message: 'Plant created successfully',
      data: {
        id: newPlantRef.id,
        ...plantData
      }
    });
  } catch (error) {
    console.error('Error creating plant:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create plant',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/plants/:id
 * @desc    Update a plant
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const plantId = req.params.id;
    const plantDoc = await plantsCollection.doc(plantId).get();
    
    if (!plantDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: `Plant with ID ${plantId} not found`
      });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await plantsCollection.doc(plantId).update(updateData);
    
    res.status(200).json({
      status: 'success',
      message: 'Plant updated successfully',
      data: {
        id: plantId,
        ...updateData
      }
    });
  } catch (error) {
    console.error(`Error updating plant ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update plant',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/plants/:id
 * @desc    Delete a plant
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const plantId = req.params.id;
    const plantDoc = await plantsCollection.doc(plantId).get();
    
    if (!plantDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: `Plant with ID ${plantId} not found`
      });
    }
    
    await plantsCollection.doc(plantId).delete();
    
    res.status(200).json({
      status: 'success',
      message: 'Plant deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting plant ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete plant',
      error: error.message
    });
  }
});

module.exports = router; 