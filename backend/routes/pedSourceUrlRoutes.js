
const express = require('express');
const router = express.Router();
const pedSourceUrlController = require('../controllers/pedSourceUrlController');

// GET all source URLs
router.get('/', pedSourceUrlController.getAllSourceUrls);

// GET source URL by ID
router.get('/:id', pedSourceUrlController.getSourceUrlById);

// POST create new source URL
router.post('/', pedSourceUrlController.createSourceUrl);

// PUT update source URL
router.put('/:id', pedSourceUrlController.updateSourceUrl);

// DELETE source URL
router.delete('/:id', pedSourceUrlController.deleteSourceUrl);

module.exports = router;
