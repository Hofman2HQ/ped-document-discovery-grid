
const express = require('express');
const router = express.Router();
const pedDetailsController = require('../controllers/pedDetailsController');

// GET all PED details
router.get('/', pedDetailsController.getAllPedDetails);

// GET PED detail by ID
router.get('/:id', pedDetailsController.getPedDetailById);

// POST create new PED detail
router.post('/', pedDetailsController.createPedDetail);

// PUT update PED detail
router.put('/:id', pedDetailsController.updatePedDetail);

// DELETE PED detail
router.delete('/:id', pedDetailsController.deletePedDetail);

module.exports = router;
