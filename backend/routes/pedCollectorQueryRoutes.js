
const express = require('express');
const router = express.Router();
const pedCollectorQueryController = require('../controllers/pedCollectorQueryController');

// GET all collector queries
router.get('/', pedCollectorQueryController.getAllCollectorQueries);

// GET collector query by ID
router.get('/:id', pedCollectorQueryController.getCollectorQueryById);

// POST create new collector query
router.post('/', pedCollectorQueryController.createCollectorQuery);

// PUT update collector query
router.put('/:id', pedCollectorQueryController.updateCollectorQuery);

// DELETE collector query
router.delete('/:id', pedCollectorQueryController.deleteCollectorQuery);

// POST execute collector query
router.post('/:id/execute', pedCollectorQueryController.executeCollectorQuery);

module.exports = router;
